import { Document } from 'mongoose';
import IUser from './user.interface';

export default interface IRole extends Document {
  role: string;
  users: IUser[];
  createdAt?: Date;
  updatedAt?: Date;
  findByRoleOrCreate(roleType: string): Promise<IRole>;
}
