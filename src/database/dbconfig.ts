import mongoose from 'mongoose';
import { env } from '../config/config';

export const initializeMongo = (): void => {
    const MONGO_URI = `${(process.env.MONGODB_URI || env.MONGODB_CONNECTION)}`;
    mongoose.set('useFindAndModify', true);
    // mongoose.set('debug', true);
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then( db => console.log('DB is connected') );
}
