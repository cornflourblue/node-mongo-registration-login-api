import { Document, Schema, Model, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import IUser from '../interfaces/user.interface';

// Inteface
export interface IUserModel extends IUser, Document {
    isValidPassword(thisUser: IUser, password: string): Promise<boolean>;
}

// Validation callbacks
const uniqueEmail = async (email: string): Promise<boolean> => {
    const user = await User.findOne({ email });
    return !user;
};

const validEmail = (email: string): boolean => {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
};

// Setter
const encryptPassword = (password: string) => {
    const salt = bcrypt.genSaltSync(10);
    const passwordDigest = bcrypt.hashSync(password, salt);
    return passwordDigest;
}

// Schema
const userSchema = new Schema({
    username: { 
        type: String, 
        required: true 
    },
    email: { 
         type: String, 
         required: true, 
         unique: true
    },
    password: { 
         type: String, 
         required: true, 
         minlength: 8,
         set: encryptPassword
    },
    createdAt: { 
         type: Date, 
         default: Date.now 
    },
    updatedAt: Date,
});

// Model
const User: Model<IUserModel> = model<IUserModel>('User', userSchema);

// Model methods
User.schema.method('isValidPassword', async function(thisUser: IUser, password: string): Promise<boolean>{
    try{
        return await bcrypt.compare(password, thisUser.password);
    } catch(err){
        throw new Error(err);
    }
});

// Model Validations
User.schema.path('email').validate(uniqueEmail, 'This email address is already registered');

User.schema.path('email').validate(validEmail, 'The e-mail field most be type of email.');

export default User;