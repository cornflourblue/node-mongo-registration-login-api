import { Schema, Model, model } from 'mongoose';
import IPatient from '../interfaces/patient.interface';
import { env } from '../config/config';
import needle from 'needle';

// Schema
export const patientSchema = new Schema({
  dni: {
    type: String,
    required: '{PATH} is required'
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
  status: {
    type: String,
    enum: ['Validado', 'Temporal'],
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
    // Buscar paciente en db local
    let patient: IPatient | null = await Patient.findOne({ dni: patientParam.dni, sex: patientParam.sex});

    // Si no está local, buscar en MPI de Andes y guardar
    if(!patient){
      const resp =  await needle("get", env.ANDES_MPI_ENDPOINT + "?documento=" +patientParam.dni, {headers: { 'Authorization': env.JWT_MPI_TOKEN}})     
      resp.body.forEach(async function (item: any) {
        if(item.sexo === patientParam.sex.toLocaleLowerCase()){
          patient = <IPatient>{
            dni: item.documento,
            firstName: item.nombre,
            lastName: item.apellido,
            sex: item.sexo[0].toUpperCase() + item.sexo.substr(1).toLowerCase(),
            status: item.estado[0].toUpperCase() + item.estado.substr(1).toLowerCase(),
          }

          patient = new Patient(patient);
          await patient.save();
        }
      });
    }

    // Si tampoco no está local ni en MPI, crear uno nuevo
    if(!patient){
      patient = new Patient(patientParam);
      await patient.save();
    }
    return patient;
  } catch(err){
    throw new Error(err);
  }
});

export default Patient;
