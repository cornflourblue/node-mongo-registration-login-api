import { Document } from 'mongoose';
import IRole from './role.interface';
export default interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    businessName: string;
    roles: IRole[];
    enrollment?: string;
    cuil?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isValidPassword(thisUser: IUser, password: string): Promise<boolean>;
}
