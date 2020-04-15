import {Request, Response, NextFunction} from 'express';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import config from '../config/env.config';
import User from '../models/user.model';

const JwtStrategy = passportJwt.Strategy;
const LocalStrategy = passportLocal.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// Config passport JWT strategy
// We will use Bearer token to authenticate
// This configuration checks:
//  -token expiration
//  -user exists
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: (process.env.JWT_SECRET || config.JWT_SECRET)
}, async (payload, done) => {
    try{
        const expirationDate = new Date(payload.exp * 1000);
        if(expirationDate < new Date()) {
            return done(null, false, {message: 'expired token'});
        }
        // find the user specified in token
        const user = await User.findOne({ _id: payload.sub }).select('_id');

        // if user doesn't exists, handle it
        if(!user){
            return done(null, false, {message: 'Unauthorized.'});
        }

        // otherwise, return the user
        done(null, user);
    }catch(err){
        done(err, false);
    }
}));

// Config passport Local strategy
// This onfiguration it uses to login:
// checks if the user exist by email or username
// then compares the passwords
passport.use(new LocalStrategy({
    usernameField: 'identifier',
    passwordField: 'password'
}, async (identifier, password, done) => {
    try{
        // find the user given the identifier
        let user = await User.findOne({ email: identifier });

        // if not, handle it
        if(!user){
            user = await User.findOne({ username: identifier });
            if(!user){
                return done(null, false, {message: 'El usuario o contraseña que has ingresado es incorrecto. Por favor intenta de nuevo.'});
            }
        }

        // check if the password is correct
        const isMatch = await user.schema.methods.isValidPassword(user, password);

        // if not, handle it
        if(!isMatch){
            return done(null, false, {message: 'El usuario o contraseña que has ingresado es incorrecto. Por favor intenta de nuevo.'});
        }
        // otherwise, return the user
        done(null, user);
    }catch(err){
        done(err, false);
    }
}));

const authenticationMiddleware = (req: Request, res: Response, next: NextFunction, authenticationType: string) => {
    passport.authenticate(authenticationType, {session: false}, (err, user, info) => {
        if (err) { return next(err) }
        if (!user) {
            return res.status(401).json(info);
        }
        req.user = user;
        next();
    })(req, res, next);
};

// authentication methods
export const passportMiddlewareLocal = (req: Request, res: Response, next: NextFunction) => {
    authenticationMiddleware(req, res, next, 'local');
};

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {

        if (err) { return next(err) }
        else if(info instanceof Error){
            return res.status(403).json({message: 'No Autorizado'});
        } else if (!user) {
            return res.status(401).json(info);
        }
        req.user = user;
        next();
    })(req, res, next);
}
