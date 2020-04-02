import {Request, Response, NextFunction} from 'express';
import passport from 'passport';
import passportJwt from 'passport-jwt';
import passportLocal from 'passport-local';
import config from '../config/passport';
import User from '../models/user.model';

const JwtStrategy = passportJwt.Strategy;
const LocalStrategy = passportLocal.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;

// Config passport JWT strategy
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.JWT_SECRET
}, async (payload, done) => {
    try{
        // find the user specified in token
        const user = await User.findOne({ _id: payload.sub });
        
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
passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'    
}, async (email, password, done) => {
    try{
        // find the user given the email
        const user = await User.findOne({ email });
        
        // if not, handle it
        if(!user){
            return done(null, false, {message: 'Invalid credentials.'});
        }
        
        // check if the password is correct
        const isMatch = await user.schema.methods.isValidPassword(user, password);
        
        // if not, handle it
        if(!isMatch){
            return done(null, false, {message: 'Invalid credentials.'});
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
            return res.status(400).json(info);
        }
        req.user = user;
        next();
    })(req, res, next);
};

// authentication methods
export const passportMiddlewareLocal = (req: Request, res: Response, next: NextFunction) => {
    authenticationMiddleware(req, res, next, 'local');
};

export const passportMiddlewareJwt = (req: Request, res: Response, next: NextFunction) => {
    authenticationMiddleware(req, res, next, 'jwt');
}