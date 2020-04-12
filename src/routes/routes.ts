
import { Router } from 'express';
import { passportMiddlewareLocal, passportMiddlewareJwt } from '../middlewares/passport-config.middleware';
import { pharmacistRoleMiddleware, professionalRoleMiddleware } from '../middlewares/roles.middleware';
// interfaces
import { BaseController } from '../interfaces/classes/base-controllers.interface';
// controllers
import authController from '../controllers/auth.controller';
import roleController from '../controllers/role.controller';
import prescriptionController from '../controllers/prescription.controller';
import patientController from '../controllers/patient.controller';
import pharmacistController from '../controllers/pharmacist.controller';
import professionalController from '../controllers/professional.controller';
import pharmacyController from '../controllers/pharmacy.controller';
import supplyController from '../controllers/supply.controller';


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
    this.router.post('/users/:id/assign-role', authController.assignRole);

    // pharmacistRoleMiddleware, professionalRoleMiddleware 2 middlewares, para determinar a que routa tiene accesos el farmaceutico y/o profesional
    // ejemplo:
    // this.router.post('/test', passportMiddlewareJwt, pharmacistRoleMiddleware, testController.tmp);

    // this.router.post('/roles/:id/assign-user', roleController.assignUser);

    this.router.get('/patients/get-by-dni/:dni', patientController.getByDni);

    this.router.patch('/prescriptions/dispense/:id', prescriptionController.dispense);
    this.router.get('/prescriptions/get-by-patient-and-date/:patientId&:date', prescriptionController.getByPatientAndDate);
    this.router.get('/prescriptions/get-by-patient-id/:patient_id', prescriptionController.getByPatientId);
    this.router.get('/supplies/get-by-name', supplyController.getByName);

    this.router.use('', passportMiddlewareJwt, this.resources('roles', roleController));

    this.router.use('', passportMiddlewareJwt, this.resources('prescriptions', prescriptionController));

    this.router.use('', passportMiddlewareJwt, this.resources('patients', patientController));

    this.router.use('', passportMiddlewareJwt, this.resources('pharmacists', pharmacistController));
    this.router.use('', passportMiddlewareJwt, this.router.get('pharmacists/getByEnrollment/:enrollment', pharmacistController.getByEnrollment));

    this.router.use('', passportMiddlewareJwt,this.resources('pharmacies', pharmacyController));

    this.router.use('', passportMiddlewareJwt, this.resources('professionals', professionalController));

    this.router.use('', passportMiddlewareJwt, this.resources('supplies', supplyController));
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
