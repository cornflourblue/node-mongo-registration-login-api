import { Router, Request, Response } from 'express';

import { hasPermissionIn } from '../middlewares/roles.middleware';
// interfaces
import { BaseController } from '../interfaces/classes/base-controllers.interface';

// controllers
// import roleController from '../controllers/role.controller';
import prescriptionController from '../controllers/prescription.controller';
import patientController from '../controllers/patient.controller';
// import pharmacistController from '../controllers/pharmacist.controller';
// import professionalController from '../controllers/professional.controller';
// import pharmacyController from '../controllers/pharmacy.controller';
import supplyController from '../controllers/supply.controller';
import authController from '../controllers/auth.controller';
class PrivateRoutes{

  constructor(private router: Router = Router()){}

  public routes(): Router{
    // test route: only requires authentication
    // this.router.get('/test', (req: Request, res: Response): Response => {
    //   return res.status(200).json('test OK!');
    // });

    // this.router.post('/users/:id/assign-role', authController.assignRole);

    // pharmacistRoleMiddleware, professionalRoleMiddleware 2 middlewares, para determinar a que routa tiene accesos el farmaceutico y/o profesional
    // ejemplo:
    // this.router.post('/test', passportMiddlewareJwt, pharmacistRoleMiddleware, testController.tmp);

    // this.router.post('/roles/:id/assign-user', roleController.assignUser);

    this.router.get('/auth/user/find', hasPermissionIn('readAny','user'), authController.getUser);
    this.router.post('/auth/register', hasPermissionIn('updateAny','user'), authController.register);
    this.router.post('/auth/reset-password', authController.resetPassword);
    this.router.patch('/auth/user/:id', hasPermissionIn('updateAny','user'), authController.updateUser);

    this.router.get('/patients/get-by-dni/:dni', patientController.getByDni);
    this.router.get('/prescriptions/find/:patient_id&:date?', prescriptionController.getPrescriptionsByDateOrPatientId);
    this.router.get('/prescriptions/get-by-user-id/:userId', prescriptionController.getByUserId);
    this.router.get('/supplies/get-by-name', supplyController.getByName);

    // roles
    // this.router.get(`/roles/`, hasPermissionIn('readAny','role'), roleController.index);
    // this.router.post(`/roles/`, hasPermissionIn('createAny','role'), roleController.create);
    // this.router.get(`/roles/:id`, hasPermissionIn('readAny','role'), roleController.show);
    // this.router.put(`/roles/:id`, hasPermissionIn('updateAny','role'), roleController.update);
    // this.router.delete(`/roles/:id`, hasPermissionIn('deleteAny','role'), roleController.delete);


    // prescriptions
    this.router.get(`/prescriptions/`, hasPermissionIn('readAny','prescription'), prescriptionController.index);
    this.router.post(`/prescriptions/`, hasPermissionIn('createAny','prescription'), prescriptionController.create);
    this.router.get(`/prescriptions/:id`, hasPermissionIn('readAny','prescription'), prescriptionController.show);
    this.router.patch('/prescriptions/dispense/:prescriptionId&:userId', hasPermissionIn('updateAny','prescription'), prescriptionController.dispense);
    this.router.patch(`/prescriptions/:id`, hasPermissionIn('updateOwn','prescription'), prescriptionController.update);
    this.router.delete(`/prescriptions/:id`, hasPermissionIn('deleteAny','prescription'), prescriptionController.delete);

    // patients
    this.router.get(`/patients/`, hasPermissionIn('readAny','patient'), patientController.index);
    this.router.post(`/patients/`, hasPermissionIn('createAny','patient'), patientController.create);
    this.router.get(`/patients/:id`, hasPermissionIn('readAny','patient'), patientController.show);
    this.router.put(`/patients/:id`, hasPermissionIn('updateAny','patient'), patientController.update);
    this.router.patch('/patients/:id', hasPermissionIn('updateAny','patient'), patientController.updatePatient);
    // this.router.delete(`/patients/:id`, hasPermissionIn('deleteAny','patient'), patientController.delete);

    // pharmacist
    // this.router.get(`/pharmacists/`, hasPermissionIn('readAny','patient'), pharmacistController.index);
    // this.router.post(`/pharmacists/`, hasPermissionIn('createAny','patient'), pharmacistController.create);
    // this.router.get(`/pharmacists/:id`, hasPermissionIn('readAny','patient'), pharmacistController.show);
    // this.router.put(`/pharmacists/:id`, hasPermissionIn('updateAny','patient'), pharmacistController.update);
    // this.router.delete(`/pharmacists/:id`, hasPermissionIn('deleteAny','patient'), pharmacistController.delete);

    // pharmacy
    // this.router.get(`/pharmacies/`, hasPermissionIn('readAny','patient'), pharmacyController.index);
    // this.router.post(`/pharmacies/`, hasPermissionIn('createAny','patient'), pharmacyController.create);
    // this.router.get(`/pharmacies/:id`, hasPermissionIn('readAny','patient'), pharmacyController.show);
    // this.router.put(`/pharmacies/:id`, hasPermissionIn('updateAny','patient'), pharmacyController.update);
    // this.router.delete(`/pharmacies/:id`, hasPermissionIn('deleteAny','patient'), pharmacyController.delete);

    // professional
    // this.router.get(`/professionals/`, hasPermissionIn('readAny','patient'), professionalController.index);
    // this.router.post(`/professionals/`, hasPermissionIn('createAny','patient'), professionalController.create);
    // this.router.get(`/professionals/:id`, hasPermissionIn('readAny','patient'), professionalController.show);
    // this.router.put(`/professionals/:id`, hasPermissionIn('updateAny','patient'), professionalController.update);
    // this.router.delete(`/professionals/:id`, hasPermissionIn('deleteAny','patient'), professionalController.delete);

    // supply
    this.router.get(`/supplies/`, hasPermissionIn('readAny','patient'), supplyController.index);
    this.router.patch('/supplies/:id', hasPermissionIn('updateAny','supplies'), supplyController.update);
    // this.router.post(`/supplies/`, hasPermissionIn('createAny','patient'), supplyController.create);
    // this.router.get(`/supplies/:id`, hasPermissionIn('readAny','patient'), supplyController.show);
    // this.router.put(`/supplies/:id`, hasPermissionIn('updateAny','patient'), supplyController.update);
    // this.router.delete(`/supplies/:id`, hasPermissionIn('deleteAny','patient'), supplyController.delete);

    return this.router;
  }
}

const privateRoutes: PrivateRoutes = new PrivateRoutes();
export default privateRoutes.routes();
