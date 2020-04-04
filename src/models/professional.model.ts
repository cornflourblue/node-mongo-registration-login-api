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
    type: String,
    required: '{PATH} is required'
  },
  first_name: {
    type: Number,
    required: '{PATH} is required'
  },
  sex: {
    enum: ['Femenino', 'Masculino', 'Otro'],
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