import { Document } from 'mongoose';
import IRole from './role.interface';
export default interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    role: IRole;
    enrollment?: string;
    cuil?: string;
    businessName?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isValidPassword(thisUser: IUser, password: string): Promise<boolean>;
    hasRole(thisUser: IUser, rolesType: string | Array<string>): Promise<boolean>;
}