import { Request, Response } from 'express';
import * as JWT from 'jsonwebtoken';
import config from '../config/env.config';
import { v4 as uuidv4 } from 'uuid';


import IUser from '../interfaces/user.interface';
import User from '../models/user.model';

class AuthController{

    constructor(private refreshTokens: any = {}){}

    public register = async (req: Request, res: Response): Promise<Response> => {
        try{
            const { username, email, password } = req.body;
            const newUser = new User({ username, email, password });
            await newUser.save();
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

    public login = (req: Request, res: Response): Response => {
        const user = req.user as IUser;
        const token = this.signInToken(user._id);

        const refreshToken = uuidv4();
        this.refreshTokens[refreshToken] = user._id;
        return res.status(200).json({
            jwt: token,
            refreshToken: refreshToken
        });
    }

    public refresh = (req: Request, res: Response): Response => {
        const refreshToken = req.body.refreshToken;

        if (refreshToken in this.refreshTokens) {
          const token = this.signInToken(this.refreshTokens[refreshToken]);
          return res.json({jwt: token})
        }

        return res.sendStatus(401);
    }

    private signInToken = (userId: string): any => {
        const token = JWT.sign({
            iss: "stock.manage",
            sub: userId,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + config.TOKEN_LIFETIME)
        }, config.JWT_SECRET, {
            algorithm: 'HS256'
        });
        return token;
    }

}

export default new AuthController();
