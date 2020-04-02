import { Schema, Model, model } from 'mongoose';
import IPatient from '../interfaces/patient.interface';

// Schema
const patientSchema = new Schema({
  dni: {
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
const Patient: Model<IPatient> = model<IPatient>('Patient', patientSchema);


export default Patient;