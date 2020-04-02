import { Router } from 'express';
import authController from '../controllers/authController';
import { passportMiddlewareLocal, passportMiddlewareJwt } from '../middlewares/passportConfig';

class IndexRoutes {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes(): void {
        this.router.post('/signup', authController.signUp);
        this.router.post('/signin', passportMiddlewareLocal, authController.signIn);
        this.router.get('/profile', passportMiddlewareJwt, authController.profile);
    }
}

const indexRoutes = new IndexRoutes();

export default indexRoutes.router;