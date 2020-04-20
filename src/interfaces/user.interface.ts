import { Document } from 'mongoose';
import IRole from './role.interface';
export default interface IUser extends Document{
    username: string;
    email: string;
    businessName: string;
    enrollment?: string;
    cuil?: string;
    password: string;
    roles: IRole[];
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
    isValidPassword(thisUser: IUser, password: string): Promise<boolean>;
}
