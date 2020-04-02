import { Document } from 'mongoose';
export default interface IUser extends Document{
    username: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    isValidPassword(thisUser: IUser, password: string): Promise<boolean>;
}
