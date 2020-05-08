import mongoose from 'mongoose';
import { env } from '../config/config';


// interface
import { PrescriptionClass }  from './classes/prescriptions.class';
import IPrescriptionOld from './interfaces/prescription-deprecated.interface'; //old prescriptions



// init db connections
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
        prescriptionMigration().then(() => {
            mongoose.disconnect();
        });
    });
}

async function prescriptionMigration(){

    console.log(">> INICIANDO PROCESO DE ACTUALIZACIÓN...");

    const prescriptionClass = new PrescriptionClass();

    try{

      const prescriptionsDeprecated: IPrescriptionOld[] = await prescriptionClass.getPrescriptions();

      console.log(`>> CANTIDAD DE PRESCRIPCIONES QUE DEBEN SER ACTUALIZADAS: ${prescriptionsDeprecated.length}`);
      console.log(`>> COMENZANDO ACTUALIZACION....`);

        if(prescriptionsDeprecated){
            await prescriptionClass.updateEmbeddedFields(prescriptionsDeprecated);


        }else{
            console.log(">> NO SE ENCONTRARON PRESCRIPCIONES PARA ACTUALIZAR")
        }

        console.log('>> FIN PROCESO =====================');

    }catch(err){
        console.log("UN ERROR OCURRIO ");
        console.log(err);
    }
}

initializeMongo();
