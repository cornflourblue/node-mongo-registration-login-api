import { Router} from 'express';
import { passportMiddlewareLocal, checkAuth } from '../middlewares/passport-config.middleware';
import authController from '../controllers/auth.controller';

class AuthRoutes {

  constructor(private router: Router = Router()){}

  routes(): Router{

    this.router.post('/login', passportMiddlewareLocal, authController.login);
    this.router.get('/jwt-login', checkAuth, authController.login);
    this.router.post('/register', authController.register);
    this.router.post('/logout', authController.logout);
    this.router.post('/refresh', authController.refresh);

    return this.router;
  }
}

const authRoutes: AuthRoutes = new AuthRoutes();
export default authRoutes.routes();
