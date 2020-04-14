import { Document } from 'mongoose';
import IUser from './user.interface';
import IPermission from './permission.interface';

export default interface IRole extends Document {
  role: string;
  users: IUser[];
  permissions: IPermission[];
  createdAt?: Date;
  updatedAt?: Date;
  findByRoleOrCreate(roleType: string): Promise<IRole>;
}
