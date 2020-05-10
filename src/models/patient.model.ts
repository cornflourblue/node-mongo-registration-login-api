import { Schema, Model, model } from 'mongoose';
import IPatient from '../interfaces/patient.interface';

// Schema
export const patientSchema = new Schema({
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

Patient.schema.method('findOrCreate', async function(patientParam: IPatient): Promise<IPatient>{
  try{
    let patient: IPatient | null = await Patient.findOne({ dni: patientParam.dni});
    console.log(patient, '<========== from Patient model');
    if(!patient){
      patient = new Patient(patientParam);
      console.log(patient, '<========== on create Patient model');
      await patient.save();
    }
    return patient;
  } catch(err){
    throw new Error(err);
  }
});

export default Patient;
