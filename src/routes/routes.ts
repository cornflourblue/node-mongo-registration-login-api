
import { Router } from 'express';
import { checkAuth } from '../middlewares/passport-config.middleware';

// routes
import authRoutes from './auth';
import pbulicRoutes from './public';
import privateRoutes from './private';

class Routes {

	constructor(private router: Router = Router()){}

	public routesDefinition(): Router{
    // public routes
    // auth
    this.router.use('/auth', authRoutes);
    this.router.use('', pbulicRoutes);

    // private: requires authentication
    this.router.all('*', checkAuth, privateRoutes);

    return this.router;
  }

}

const routes = new Routes();
export default routes.routesDefinition();
