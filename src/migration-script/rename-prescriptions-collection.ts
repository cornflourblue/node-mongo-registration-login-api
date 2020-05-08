import mongoose from 'mongoose';
import { env } from '../config/config';

const initializeMongo = (): void => {
    const MONGO_URI = `${(process.env.MONGODB_URI || env.MONGODB_CONNECTION)}`;
    mongoose.Promise = Promise;
    mongoose.connect(MONGO_URI, {})
    .then( mongoose => {
        console.log('DB is connected');
        mongoose.connection.db.collection('prescriptions').rename('deprecated-prescriptions').then(db => {
            console.log(">> SE HA RENOMBRADO CORRECTAMENTE...");
            mongoose.disconnect();
        }).catch(err => {
            console.log(">> HA OCURRIDO UN ERROR AL TRATAR DE RENOMBRAR LA COLLECCION 'prescriptions' " + err);
        });
    });
}

initializeMongo();
