// treamos el modelo y la interface deprecated, para obtener los datos necesarios de la tabla "prescriptions-deprecated"
import PrescriptionDeprecated from '../models/prescription-deprecated.model';
import IPrescriptionOld from '../interfaces/prescription-deprecated.interface';

import Prescription from '../../models/prescription.model';

import User from '../../models/user.model';
import Patient from '../../models/patient.model';
import Supply from '../../models/supply.model';

import IUser from '../../interfaces/user.interface';
import IPatient from '../../interfaces/patient.interface';
import ISupply from '../../interfaces/supply.interface';


export class PrescriptionClass {

  //buscamos las prescriptciones que actualizaremos. Todas antes de la fecha actual
  public getPrescriptions = async (): Promise<IPrescriptionOld[]> => {
    try{
      return await PrescriptionDeprecated.find();
    }catch(err){
      throw new Error("OCURRIO UN ERROR AL OBTENER LAS PRESCRIPCIONES: " + err);
    }
  }

  public updateEmbeddedFields = async (prescriptions: IPrescriptionOld[]): Promise<void> => {
    // actualizamos la estructura de los datos de la prescripcion
    await Promise.all(prescriptions.map( async (prescription: IPrescriptionOld) => {
        try{
            // buscamos al profesional, para embeber sus datos. No debe haber recetas sin profesional
            const professional: IUser = await this.getProfessionalData(prescription.user);
            if(!professional) throw new Error(`>> EL PROFESIONAL NO FUE ENCONTRADO: ${prescription.user}`);

            // buscamos al paciente, para embeber sus datos. No debe haber recetas sin paciente
            let patient: IPatient = await this.getPatientData(prescription.patient);
            if(!patient) throw new Error(`>> EL PASIENTE NO FUE ENCONTRADO: ${prescription.patient}`);

            // actualizamos al profesional y al paciente
            const newPrescription = new Prescription({
                    "professional": {
                        "userId": professional._id,
                        "businessName": professional.businessName,
                        "enrollment": professional.enrollment,
                        "cuil": professional.cuil,
                    },
                    "patient": patient,
                    "status": prescription.status,
                    "observation": prescription.observation,
                    "date": prescription.date,
                    "createdAt": prescription.createdAt,
              });
              await newPrescription.save(); // transfer data to the new schema

            // buscamos los datos de las farmacias, para embeber sus datos (solo si estas fueron dispensadas)
            if(prescription.status.toLowerCase() === 'dispensada'){
                let pharmacist: IUser = await this.getPharmacistData(prescription.dispensedBy);
                await this.updatePharmacist(newPrescription._id, pharmacist);
            }

            // actualizamos los datos de los medicamentos a embebidos
            await this.updatePrescriptionSupplies(newPrescription._id, prescription.supplies);

            console.log(newPrescription._id, "<================PRESCRIPCION ACTUALIZADA CORRECTAMENTE");
        }catch(err){
            throw new Error(`>> OCURRIO UN ERROR AL TRATAR DE ACTUALIZAR LA PRESCRIPCION: ${prescription._id} ` + err);
        }
    }));
  }

  // actualizamos los datos de la farmacia que dispenso la receta (dataos embebidos)
  private updatePharmacist = async (prescriptionId: string, pharmacist: IUser): Promise<void> => {
    try{
        await Prescription.updateOne({_id: prescriptionId}, {
            $set: {
                "dispensedBy": {
                    "userId": pharmacist._id,
                    "businessName": pharmacist.businessName,
                    "cuil": pharmacist.cuil
                }
            }
        });
    }catch(err){
        throw new Error(`>> OCURRIO UN ERROR AL ACTUALIZAR LA FARMACIA: [${pharmacist._id}] QUE DISPENSO ESTA PRESCRIPCION: [${prescriptionId}] ` + err);
    }
  }

  // le pasamos el array de insumos referenciados, y actualizamos a embebido
  private updatePrescriptionSupplies = async (prescriptionId: string, suppliesDeprecated: any ): Promise<void> => {
    try{
        const supplies: any = [];
        // metemos todos los insumos en un array, con la cantidad de cada uno
        await Promise.all(suppliesDeprecated.map( async (sup:any) => {
          const supply: ISupply | null = await Supply.findOne({'_id': sup.supply});
          if(supply){
            supplies.push({
              supply,
              quantity: sup.quantity
            });
          }
        }));

        // grabamos el array de insumos
        await Prescription.updateOne({"_id": prescriptionId}, {
            $set:{
                "supplies": supplies
            }
        });
    }catch(err){
        throw new Error(`>> OCURRIO UN ERROR AL TRATAR DE ACTUALIZAR LOS DATOS DE LOS MEDICAMENTOS: ${suppliesDeprecated} DE LA PRESCRIPCION: ${prescriptionId}` + err);
    }

  }

  // Buscamos los datos del profesional
  private getProfessionalData = async (professionalId: any): Promise<IUser> => {
    try{
      const user: IUser | null = await User.findOne({"_id": professionalId});
      if(!user) throw new Error;
      return user;
    }catch(err){
        throw new Error(`>> OCURRIO UN ERROR AL OBTENER LOS DATOS DEL PROFESIONAL: ${professionalId} ` + err);
    }
  }

  // Buscamos los datos del paciente
  private getPatientData = async (patientId: any): Promise<IPatient> => {
    try{
      const patient: IPatient | null = await Patient.findOne({"_id": patientId});
      if(!patient) throw new Error;
      return patient;
    }catch(err){
        throw new Error(`>> OCURRIO UN ERROR AL OBTENER LOS DATOS DEL PACIENTE: ${patientId} ` + err);
    }
  }

  // Buscamos los datos de la farmacia que dispenso la receta
  private getPharmacistData = async (pharmacistId: any): Promise<IUser> => {
    try{
      const user: IUser|null = await User.findOne({"_id": pharmacistId});
      if(!user) throw new Error;
      return user;
    }catch(err){
        throw new Error(`>> OCURRIO UN ERROR AL OBTENER LOS DATOS DE LA FARMACIA: ${pharmacistId} ` + err);
    }
  }

}
