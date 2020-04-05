import { Request, Response } from 'express';
import Role from '../models/role.model';
import IRole from '../interfaces/role.interface';
import User from '../models/user.model';
import IUser from '../interfaces/user.interface';
import { BaseController } from '../interfaces/classes/base-controllers.interface';

class RoleController implements BaseController{

  public index = async (req: Request, res: Response): Promise<Response> => {
    const roles: IRole[] = await Role.find();
    return res.status(200).json({roles});
  }

  public create = async (req: Request, res: Response): Promise<Response> => {
    const { role } = req.body;
    const newRole: IRole = new Role({ role });
    try{
      await newRole.save();
      return res.status(200).json({ newRole });
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public show = async (req: Request, res: Response): Promise<Response> => {
    try{
      const id: string = req.params.id;
      const role: IRole | null = await Role.findOne({_id: id});
      return res.status(200).json(role);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public update = async (req: Request, res: Response) => {
    try{
      const id: string = req.params.id;
      const { role } = req.body;
      await Role.findByIdAndUpdate(id, {
        role
      });
      const roleFound = await Role.findOne({_id: id});
      return res.status(200).json(roleFound);
    } catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public delete =  async (req: Request, res: Response): Promise<Response> => {
    try{

      const { id } = req.params;
      await Role.findByIdAndDelete(id);
      return res.status(200).json('deleted');
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }

  public assignUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { userId } = req.body;
    try{

      const role: IRole | null = await Role.findOne({ _id : id });
      if(role){
        const user: IUser | null = await User.findOne({ _id : userId });
        if(user){
          role.users.push(user);
          await role.save();
        }
      }
      return res.status(200).json(role);
    }catch(err){
      console.log(err);
      return res.status(500).json('Server Error');
    }
  }
}

export default new RoleController();
