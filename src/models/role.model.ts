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

Role.schema.method('findByRoleOrCreate', async function(roleType: string): Promise<IRole>{
  try{
    let role: IRole | null = await Role.findOne({ role: roleType});
    if(!role){
      role = new Role({ role: roleType});
      await role.save();
    }
    return role;
  } catch(err){
    throw new Error(err);
  }
});

export default Role;
