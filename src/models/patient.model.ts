import { Schema, Model, model } from 'mongoose';
import IPatient from '../interfaces/patient.interface';

// Schema
const patientSchema = new Schema({
  dni: {
    type: String,
    required: '{PATH} is required',
    index: true,
    unique: true
  },
  lastName: {
    type: String,
    required: '{PATH} is required'
  },
  firstName: {
    type: String,
    required: '{PATH} is required'
  },
  sex: {
    type: String,
    enum: ['Femenino', 'Masculino', 'Otro'],
    required: '{PATH} is required'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: Date,
});

// Model
const Patient: Model<IPatient> = model<IPatient>('Patient', patientSchema);

export default Patient;
