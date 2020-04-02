import mongoose from 'mongoose';
import config from '../config/env.config';

export const initializeMongo = (): void => {
    const MONGO_URI = `${(process.env.MONGODB_URI || config.MONGODB_CONNECTION)}`;
    mongoose.set('useFindAndModify', true);
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then( db => console.log('DB is connected') );
}
