import { Request, Response, NextFunction, response } from 'express';
import accessControl from '../utils/rbac_abac';
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


const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// middleware with param
export const hasPermissionIn = (action: string, resource: string) => {
  return async function(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    const { _id } = req.user as IUser;
    const user: IUser | null = await User.findOne({ _id }).populate({ path: 'roles', select: 'role'}); //get users roles
    const roles: string[] = [];
    if(user){
      // prepare an roles array
      await Promise.all( user.roles.map( async (rol: any) => {
        roles.push(rol.role);
        // await sleep(3000).then(() => console.log('sleep into')); //test timer
      }));

    }
    console.log(user?.roles, roles, 'user');
    const permissions: boolean = checkByAction(roles, action, resource);

    if(!permissions) return res.status(406).json('No tiene los permisos suficientes para llevar a acabo esta acción.');

    next();
  }
}

const checkByAction = (role: string | string[], action: string, resource: string) => {

  let permission;
  switch(action) {
    case 'createAny':
      permission = accessControl.can(role).createAny(resource);
      break;
    case 'createOwn':
       permission = accessControl.can(role).createAny(resource);
      break;
    case 'readAny':
       permission = accessControl.can(role).readAny(resource);
      break;
    case 'readOwn':
       permission = accessControl.can(role).readOwn(resource);
      break;
    case 'updateAny':
       permission = accessControl.can(role).updateAny(resource);
      break;
    case 'updateOwn':
       permission = accessControl.can(role).updateOwn(resource);
      break;
    case 'deleteAny':
       permission = accessControl.can(role).deleteAny(resource);
      break;
    case 'deleteOwn':
       permission = accessControl.can(role).deleteOwn(resource);
      break;
  }
  return permission ? permission.granted : true;
}
