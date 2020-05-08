import mongoose from 'mongoose';
import { env } from '../config/config';


// interface
import IPrescriptionOld from './interfaces/prescription-deprecated.interface';
import IPrescription from '../interfaces/prescription.interface';
import { PrescriptionClass }  from './classes/prescriptions.class';

import User from '../models/user.model';




const initializeMongo = (): void => {
    const MONGO_URI = `${(process.env.MONGODB_URI || env.MONGODB_CONNECTION)}`;
    mongoose.Promise = Promise;
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then( mongoose => {
        console.log('DB is connected');
        prescriptionMigration();
    });
}

async function prescriptionMigration(){
    console.log(">> INICIANDO PROCESO...");



    const prescriptionClass = new PrescriptionClass();

    try{

      const prescriptions: IPrescriptionOld[] = [];
    //   const prescriptions: OldPrescription[] = await prescriptionClass.getPrescriptions();

      console.log(`>> CANTIDAD DE PRESCRIPCIONES QUE DEBEN SER ACTUALIZADAS: ${prescriptions.length}`);
      console.log(`>> COMENZANDO ACTUALIZACION....`);

        if(prescriptions){
            // actualizamos los nombres de los atributos de las prescripciones
            // await prescriptionClass.changeToDeprecatedField(prescriptions);

            // luego buscamos las mismas prescripciones (ya con los atributos actualizados) y rellenamos los atributos con datos embebidos
            // const prescriptions_ids: any = await Promise.all(prescriptions.map(function(pres) { return pres._id; }));
            // const prescriptionsToUpdate: IPrescription[] = await prescriptionClass.getUpdatedPrescriptionsAttriubte(prescriptions_ids);
// console.log(prescriptionsToUpdate[0].user_deprecated,'from index');
            // await prescriptionClass.updateEmbeddedFields(prescriptionsToUpdate);


        }else{
            console.log(">> NO SE ENCONTRARON PRESCRIPCIONES PARA ACTUALIZAR")
        }

        // console.log('>> FIN PROCESO =====================');

    }catch(err){
        console.log("UN ERROR OCURRIO ");
        console.log(err);
    }
}


initializeMongo();
