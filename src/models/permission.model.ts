import { Schema, Model, model } from 'mongoose';
import IPermission from '../interfaces/permission.interface';

// Schema
const permissionSchema = new Schema({
  resource: {
    type: String,
    required: '{PATH} is required'
  },
  action: {
    type: String,
    required: '{PATH} is required'
  },
  attributes: [{
    type: String,
    required: '{PATH} is required'
  }],
  roles: [{
    type: Schema.Types.ObjectId,
    ref: 'Role'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
});

// Model
const Permission: Model<IPermission> = model<IPermission>('Permission', permissionSchema);

export default Permission;
