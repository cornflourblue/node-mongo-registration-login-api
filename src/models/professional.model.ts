import { Schema, Model, model } from 'mongoose';
import IProfessional from '../interfaces/professional.interface';

// Schema
const professionalSchema = new Schema({
  dni: {
    type: String
  },
  enrollment: {
    type: String
  },
  last_name: {
    type: String
  },
  first_name: {
    type: Number
  },
  sex: {
    type: Number
  },
  image: {
    type: String
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: Date,
});

// Model
const Professional: Model<IProfessional> = model<IProfessional>('Professional', professionalSchema);


export default Professional;