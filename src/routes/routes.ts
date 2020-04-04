
import { Router } from 'express';
import { passportMiddlewareLocal, passportMiddlewareJwt } from '../middlewares/passport-config.middleware';
// interfaces
import { BaseController } from '../interfaces/classes/base-controllers.interface';
// controllers
import authController from '../controllers/auth.controller';
import patientController from '../controllers/patient.controller';
import pharmacistController from '../controllers/pharmacist.controller';
import professionalController from '../controllers/professional.controller';
import pharmacyController from '../controllers/pharmacy.controller';

class Routes {
	router: Router;
	resourcesRouter: Router;

	constructor(){
		this.router = Router();
		this.resourcesRouter = Router();
		this.routesDefinition();
	}

	routesDefinition(): void{
    // auth
		this.router.post('/auth/register', authController.register);
    this.router.post('/auth/login', passportMiddlewareLocal, authController.login);
    this.router.post('/auth/logout', authController.logout);
    this.router.post('/auth/refresh', authController.refresh);


    this.router.use('', passportMiddlewareJwt, this.resources('patients', patientController));

    this.router.use('', passportMiddlewareJwt, this.resources('pharmacists', pharmacistController));
    this.router.use('', passportMiddlewareJwt, this.router.get('pharmacists/getByEnrollment/:enrollment', pharmacistController.getByEnrollment));
    this.router.use('', passportMiddlewareJwt,this.resources('pharmacies', pharmacyController));

    this.router.use('', passportMiddlewareJwt, this.resources('professionals', professionalController));
    this.router.use('', passportMiddlewareJwt, this.resources('professionals', professionalController));
  }

  // resources function make easy generates CRUD routes
  // the controller param should implements BaseContrller interface.
  resources(entity: string, controller: BaseController): Router{
    this.resourcesRouter.get(`/${entity}/`, controller.index);
    this.resourcesRouter.post(`/${entity}/`, controller.create);
		this.resourcesRouter.get(`/${entity}/:id`, controller.show);
    this.resourcesRouter.put(`/${entity}/:id`, controller.update);
    this.resourcesRouter.delete(`/${entity}/:id`, controller.delete);

    return this.resourcesRouter;
  }
}

const routes = new Routes();
export default routes.router;
