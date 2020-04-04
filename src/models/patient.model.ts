import { Schema, Model, model } from 'mongoose';
import IPatient from '../interfaces/patient.interface';

// Schema
const patientSchema = new Schema({
  dni: {
    type: String,
    required: '{PATH} is required'
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
    type: String,
    enum: ['Masculino', 'Femenino', 'Otro'],
    required: '{PATH} is required'
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
const Patient: Model<IPatient> = model<IPatient>('Patient', patientSchema);


export default Patient;