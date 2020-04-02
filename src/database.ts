import mongoose from 'mongoose';

export const initializeMongo = (): void => {
    const MONGO_URI = 'mongodb://mongo:27017/mst-app';
    mongoose.set('useFindAndModify', true);
    mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then( db => console.log('DB is connected') );
}