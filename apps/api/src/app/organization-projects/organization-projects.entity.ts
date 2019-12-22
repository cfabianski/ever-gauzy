import {
	Column,
	Entity,
	Index,
	JoinColumn,
	ManyToOne,
	ManyToMany
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
	IsNotEmpty,
	IsString,
	IsOptional,
	IsDate,
	IsEnum
} from 'class-validator';
import { Base } from '../core/entities/base';
import {
	OrganizationProjects as IOrganizationProjects,
	CurrenciesEnum
} from '@gauzy/models';
import { OrganizationClients } from '../organization-clients';
import { Employee } from '../employee';

@Entity('organization_projects')
export class OrganizationProjects extends Base
	implements IOrganizationProjects {
	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	@Index()
	@Column()
	name: string;

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	@Column()
	organizationId: string;

	@ApiPropertyOptional({ type: OrganizationClients })
	@ManyToOne((type) => OrganizationClients, (client) => client.projects, {
		nullable: true,
		onDelete: 'CASCADE'
	})
	@JoinColumn()
	client?: OrganizationClients;

	@ApiPropertyOptional({ type: Date })
	@IsDate()
	@IsOptional()
	@Column({ nullable: true })
	startDate?: Date;

	@ApiPropertyOptional({ type: Date })
	@IsDate()
	@IsOptional()
	@Column({ nullable: true })
	endDate?: Date;

	@ApiProperty({ type: String })
	@IsString()
	@IsNotEmpty()
	@Column()
	type: string;

	@ApiProperty({ type: String, enum: CurrenciesEnum })
	@IsEnum(CurrenciesEnum)
	@IsNotEmpty()
	@Index()
	@Column()
	currency: string;

	@ApiPropertyOptional({ type: Employee, isArray: true })
	@ManyToMany((type) => Employee, { nullable: true, onDelete: 'CASCADE' })
	@JoinColumn()
	team?: Employee[];
}
