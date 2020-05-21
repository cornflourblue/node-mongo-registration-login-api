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
      // Primero busca en base de RecetAR
      const patients = await Patient.find({dni: dni});

      // Si no encuentra, busca en MPI
      if( patients.length === 0){
        const resp =  await needle("get", `${process.env.ANDES_MPI_ENDPOINT}?documento=${dni}`, {headers: { 'Authorization': process.env.JWT_MPI_TOKEN}})
        resp.body.forEach(function (item: any) {
          patients.push(<IPatient>{
            dni: item.documento,
            firstName: item.nombre,
            lastName: item.apellido,
            sex: item.sexo[0].toUpperCase() + item.sexo.substr(1).toLowerCase(),
            status: item.estado[0].toUpperCase() + item.estado.substr(1).toLowerCase(),
          });
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
