import { IUser } from './user.model';
import { IBasePerTenantEntityModel } from './base-entity.model';
import { IRolePermission } from './role-permission.model';

export interface IRole extends IRoleCreateInput {
	isSystem?: boolean;
	rolePermissions?: IRolePermission[];
	users?: IUser[];
}

export interface IRoleCreateInput extends IBasePerTenantEntityModel {
	name: string
}

export interface IRoleFindInput extends IBasePerTenantEntityModel {
	name?: string;
	isSystem?: boolean;
}

export enum RolesEnum {
	SUPER_ADMIN = 'SUPER_ADMIN',
	ADMIN = 'ADMIN',
	DATA_ENTRY = 'DATA_ENTRY',
	EMPLOYEE = 'EMPLOYEE',
	CANDIDATE = 'CANDIDATE',
	MANAGER = 'MANAGER',
	VIEWER = 'VIEWER',
	INTERVIEWER = 'INTERVIEWER'
}

export interface IRoleMigrateInput extends IBasePerTenantEntityModel {
	name: string;
	isImporting: boolean;
	sourceId: string;
}

export interface IRelationalRole {
    readonly role: IRole;
    readonly roleId: IRole['id'];
}