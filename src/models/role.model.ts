import { Schema, Model, model } from 'mongoose';
import IRole from '../interfaces/role.interface';

// Schema
const roleSchema = new Schema({
  role: {
    type: String,
    required: '{PATH} is required'
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
});

// Model
const Role: Model<IRole> = model<IRole>('Role', roleSchema);


export default Role;
