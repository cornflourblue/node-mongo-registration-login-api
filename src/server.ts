import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import { errorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notFound.middleware";
import * as db from './database/dbconfig';
// config
import config from './config/env.config';

import routes from './routes/routes';

class Server {

    protected app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    config() {
        db.initializeMongo();
        this.app.set('port', process.env.PORT || 4000);
        // logger
        this.app.use(morgan('dev'));
        // security
        this.app.use(helmet());
        // request compression
        this.app.use(compression());
        this.app.use(cors());
        // middleware
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: false}));
        // routes
        this.routes();
        this.app.use(errorHandler);
        this.app.use(notFoundHandler);
    }

    routes() {
        this.app.use(`${(process.env.API_URI_PRFIX || config.API_URI_PREFIX)}`, routes);
    }

    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log(`Server on port ${this.app.get('port')}`);
        });
    }
}

const server = new Server();

server.start();
