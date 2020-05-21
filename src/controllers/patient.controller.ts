import { Request, Response } from 'express';
import Patient from '../models/patient.model';
import IPatient from '../interfaces/patient.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';
import _ from 'lodash';
import { env } from '../config/config';
import needle from 'needle';

class PatientController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const patients: IPatient[] = await Patient.find();
    return res.status(200).json({patients});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { dni, lastName, firstName, sex} = req.body;
    const newPatient: IPatient = new Patient({
      dni,
      lastName,
      firstName, 
      sex
    });
    try{
      await newPatient.save();
      return res.status(200).json({ newPatient });
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public show = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const patient: IPatient | null = await Patient.findOne({_id: id});
      return res.status(200).json(patient);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public getByDni = async (req: Request, res: Response): Promise<Response> => {
    try{
      const { dni } = req.params;
      const patients = await Patient.find({dni: dni});

      if( patients.length === 0){
        needle.get(env.ANDES_TEST_ENDPOINT + "?documento=" +dni, {headers: { 'Authorization': env.JWT_TEST_TOKEN}}, 
          async function(error: any, res: any) {
            if (!error && res.statusCode == 200){
              const patients: IPatient[] = [];
              res.body.forEach(function (item: any) {
                patients.push({
                  dni: <string>item.documento,
                  firstName: <string>item.nombre,
                  lastName: <string>item.apellido,
                  sex: <string>item.sexo,
                  status: <string>item.estado
                });
                console.log(item.documento);
                console.log(item.nombre);
              });
              return res.status(200).json(patients);       
            }
          });
      }
      return res.status(200).json(patients);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { dni, lastName, firstName, sex, image } = req.body;
      await Patient.findByIdAndUpdate(id, {
        dni,
        lastName,
        firstName,
        sex,
        image
      });
      const patient = await Patient.findOne({_id: id});
      return res.status(200).json(patient);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public updatePatient = async (req: Request, res: Response): Promise<Response> => {
    // "dni", "lastName", "firstName", "sex"
    // son los campos que permitiremos actualizar.
    const { id } = req.params;
    const values: any = {};
    try{

      _(req.body).forEach((value: string, key: string) => {
        if (!_.isEmpty(value) && _.includes(["dni", "lastName", "firstName", "sex"], key)){
          values[key] = value;
        }
      });
      const opts: any = { runValidators: true, new: true, context: 'query' };
      const patient: IPatient | null = await Patient.findOneAndUpdate({_id: id}, values, opts).select("dni lastName firstName sex");

      return res.status(200).json(patient);
    }catch(e){
      // formateamos los errores de validacion
      if(e.name !== 'undefined' && e.name === 'ValidationError'){
        let errors: { [key: string]: string } = {};
        Object.keys(e.errors).forEach(prop => {
          errors[ prop ] = e.errors[prop].message;
        });
        return res.status(422).json(errors);
      }
      console.log(e);
      return res.status(500).json("Server Error");
    }
  }

  public delete =  async (req: Request, res: Response): Promise<Response> => {
    try{

      const { id } = req.params;
      await Patient.findByIdAndDelete(id);
      return res.status(200).json('deleted');
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }
}

export default new PatientController();
