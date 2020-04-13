import { Document } from 'mongoose';
import IRole from './role.interface';

export default interface IPermission extends Document {
  resource: string;
  action: string;
  attributes: string[];
  roles: IRole[];
  createdAt?: Date;
  updatedAt?: Date;
}
