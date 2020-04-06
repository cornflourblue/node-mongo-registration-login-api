import { Request, Response, NextFunction } from 'express';
import IUser from '../interfaces/user.interface';
import User from '../models/user.model';

export const pharmacistRoleMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  const reqUser: IUser | null = <IUser> req.user;
  if (!reqUser) {
    return res.status(401).json('No Autorizado');
  }

  const isMatch: boolean = await User.schema.methods.hasRole(reqUser._id, 'pharmacist');
  console.log(isMatch);
  if(!isMatch){
    return res.status(403).json({message: 'No Autorizado'});
  }

  next();
}

export const professionalRoleMiddleware = async (req: Request, res: Response, next: NextFunction) => {

  const reqUser: IUser | null = <IUser> req.user;
  if (!reqUser) {
    return res.status(401).json('No Autorizado');
  }

  const isMatch: boolean = await User.schema.methods.hasRole(reqUser._id, 'professional');
  console.log(isMatch);
  if(!isMatch){
    return res.status(403).json({message: 'No Autorizado'});
  }

  next();
}
