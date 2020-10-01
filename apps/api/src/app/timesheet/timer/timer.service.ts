import {
	Injectable,
	Inject,
	forwardRef,
	BadRequestException
} from '@nestjs/common';
import { TimeLog } from '../time-log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { RequestContext } from '../../core/context';
import { Employee } from '../../employee/employee.entity';
import { TimeLogType, ITimerStatus } from '@gauzy/models';
import * as moment from 'moment';
import { TimeSheetService } from '../timesheet/timesheet.service';
import { TimeSlotService } from '../time-slot/time-slot.service';

@Injectable()
export class TimerService {
	constructor(
		@Inject(forwardRef(() => TimeSheetService))
		private readonly timesheetService: TimeSheetService,
		@Inject(forwardRef(() => TimeSlotService))
		private readonly timeSlotService: TimeSlotService,

		@InjectRepository(TimeLog)
		private readonly timeLogRepository: Repository<TimeLog>,

		@InjectRepository(Employee)
		private readonly employeeRepository: Repository<Employee>
	) {}

	async getTimerStatus(): Promise<ITimerStatus> {
		const user = RequestContext.currentUser();
		const employee = await this.employeeRepository.findOne({
			userId: user.id
		});

		if (!employee) {
			throw new BadRequestException('Employee not found.');
		}

		const todayLog = await this.timeLogRepository.find({
			where: {
				employeeId: employee.id,
				startedAt: MoreThan(moment().format('YYYY-MM-DD'))
			},
			order: {
				startedAt: 'DESC'
			}
		});
		const stauts: ITimerStatus = {
			duration: 0,
			running: false,
			lastLog: null
		};
		if (todayLog.length > 0) {
			const lastLog = todayLog[0];
			stauts.lastLog = lastLog;

			if (lastLog.stoppedAt) {
				stauts.running = false;
			} else {
				stauts.running = true;
				stauts.duration = Math.abs(
					(lastLog.startedAt.getTime() - new Date().getTime()) / 1000
				);
			}
			for (let index = 0; index < todayLog.length; index++) {
				stauts.duration += todayLog[index].duration;
			}
		}
		return stauts;
	}

	async toggleTimeLog(request): Promise<TimeLog> {
		const user = RequestContext.currentUser();
		const lastLog = await this.timeLogRepository.findOne({
			where: {
				employeeId: user.employeeId
			},
			order: {
				startedAt: 'DESC'
			}
		});

		const timesheet = await this.timesheetService.createOrFindTimeSheet(
			user.employeeId,
			request.startedAt
		);

		let organizationId;
		if (!request.organizationId) {
			const employee = await this.employeeRepository.findOne(
				user.employeeId
			);
			organizationId = employee.organizationId;
		} else {
			organizationId = request.organizationId;
		}

		let newTimeLog: TimeLog;
		if (!lastLog || lastLog.stoppedAt) {
			newTimeLog = await this.timeLogRepository.save({
				tenantId: RequestContext.currentTenantId(),
				duration: 0,
				timesheetId: timesheet.id,
				isBilled: false,
				startedAt: new Date(),
				employeeId: user.employeeId,
				projectId: request.projectId || null,
				taskId: request.taskId || null,
				clientId: request.clientId || null,
				logType: request.logType || TimeLogType.TRACKED,
				description: request.description || '',
				isBillable: request.isBillable || false
			});
			console.log({ newTimeLog });
		} else {
			const stoppedAt = new Date();
			if (lastLog.startedAt === stoppedAt) {
				await this.timeLogRepository.delete(lastLog.id);
				return;
			}
			await this.timeLogRepository.update(lastLog.id, {
				stoppedAt
			});
			// await this.timesheetRepository.update(timesheet.id, { duration });
			newTimeLog = await this.timeLogRepository.findOne(lastLog.id);

			if (!request.manualTimeSlot) {
				let timeSlots = this.timeSlotService.generateTimeSlots(
					newTimeLog.startedAt,
					newTimeLog.stoppedAt
				);
				timeSlots = timeSlots.map((slot) => ({
					...slot,
					employeeId: user.employeeId,
					keyboard: 0,
					mouse: 0,
					overall: 0
				}));
				await this.timeSlotService.bulkCreate(timeSlots);
			}
		}
		return newTimeLog;
	}
}
