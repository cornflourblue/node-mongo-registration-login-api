import { Request, Response } from 'express';
import * as JWT from 'jsonwebtoken';
import config from '../config/env.config';
import { v4 as uuidv4 } from 'uuid';


import IUser from '../interfaces/user.interface';
import User from '../models/user.model';
import IRole from '../interfaces/role.interface';
import Role from '../models/role.model';

class AuthController{

    constructor(private refreshTokens: any = {}){}

    public register = async (req: Request, res: Response): Promise<Response> => {
        try{
            const { username, email, enrollment, cuil, businessName, password, roleType } = req.body;
            const newUser = new User({ username, email, password, enrollment, cuil, businessName });
            const role: IRole = await Role.schema.methods.findByRoleOrCreate(roleType);
            newUser.roles.push(role);
            role.users.push(newUser);
            await newUser.save();
            await role.save();
            return res.status(200).json({
                newUser
            });

        }catch(e){
            let errors: { [key: string]: string } = {};
            Object.keys(e.errors).forEach(prop => {
                errors[ prop ] = e.errors[prop].message;
            });
            return res.status(422).json(errors);
        }
    }

    public resetPassword = async (req: Request, res: Response): Promise<Response> => {
        const { _id } = req.user as IUser;
        const { oldPassword, newPassword } = req.body;
        try{
            const user: IUser | null = await User.findOne({ _id });
            if(!user) return res.status(404).json('No se ha encontrado el usuario');
            const isMatch: boolean = await User.schema.methods.isValidPassword(user, oldPassword);
            if(!isMatch) return res.status(401).json({ message: 'Su contraseña actual no coincide con nuestros registros'});

            await user.update({password: newPassword});
            return res.status(200).json('Se ha modificado la contraseña correctamente!');
        }catch(err){
            console.log(err);
            return res.status(500).json('Server Error');
        }
    }

    public login = async (req: Request, res: Response): Promise<Response> => {
        const { _id } = req.user as IUser;
            try{

                const user: IUser | null = await User.findOne({_id}).populate({path: 'roles', select: 'role'});

                if(user){
                    const roles: string | string[] = [];
                    await Promise.all(user.roles.map( async (role) => {
                        roles.push(role.role);
                    }));
                    const token = this.signInToken(user._id, user.username, roles);
                    // const token = this.signInToken(user._id, user.username, user.role.role);

                    const refreshToken = uuidv4();
                    this.refreshTokens[refreshToken] = user._id;
                    return res.status(200).json({
                        jwt: token,
                        refreshToken: refreshToken
                    });
                }
                throw new Error('user not found');
            }catch(err){
                console.log(err);
                return res.status(500).json('Server Error');
            }
    }

    public logout = (req: Request, res: Response) => {

        const refreshToken = req.body.refreshToken;
        if (refreshToken in this.refreshTokens) {
          delete this.refreshTokens[refreshToken];
        }
        res.sendStatus(204);
    }

    public refresh = async (req: Request, res: Response): Promise<Response> => {
        const refreshToken = req.body.refreshToken;
        try{

            if (refreshToken in this.refreshTokens) {
                const user: IUser | null = await User.findOne({_id: this.refreshTokens[refreshToken] }).populate({path: 'roles', select: 'role'});
                if(user){
                    const roles: string | string[] = [];
                    await Promise.all(user.roles.map( async (role) => {
                        roles.push(role.role);
                    }));

                    // const token = this.signInToken(user._id, user.username, user.role.role);
                    const token = this.signInToken(user._id, user.username, roles);
                    return res.json({jwt: token})
                }
            }
            throw new Error('user not found');
        }catch(err){
            console.log(err);
            return res.status(500).json('Server error');
        }

    }

    public assignRole = async (req: Request, res: Response): Promise<Response> => {
        const { id } = req.params;
        const { roleId } = req.body;
        try{
            const role: IRole | null = await Role.findOne({ _id : roleId });
            if(role){
                await User.findByIdAndUpdate({ _id: id },{
                    roles: role
                });
            }
            const user: IUser | null = await User.findOne({ _id : id });
          return res.status(200).json(user);
        }catch(err){
          console.log(err);
          return res.status(500).json('Server Error');
        }
      }

    private signInToken = (userId: string, username: string, role: string | string[]): any => {
        const token = JWT.sign({
            iss: "recetar.andes",
            sub: userId,
            usrn: username,
            rl: role,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + config.TOKEN_LIFETIME)
        }, config.JWT_SECRET, {
            algorithm: 'HS256'
        });
        return token;
    }

}

export default new AuthController();
