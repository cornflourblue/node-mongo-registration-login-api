"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_2 = __importDefault(require("../config/passport"));
const user_model_1 = __importDefault(require("../models/user.model"));
const JwtStrategy = passport_jwt_1.default.Strategy;
const LocalStrategy = passport_local_1.default.Strategy;
const ExtractJwt = passport_jwt_1.default.ExtractJwt;
// Config passport JWT strategy
passport_1.default.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: passport_2.default.JWT_SECRET
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find the user specified in token
        const user = yield user_model_1.default.findOne({ _id: payload.sub });
        // if user doesn't exists, handle it
        if (!user) {
            return done(null, false, { message: 'Unauthorized.' });
        }
        // otherwise, return the user
        done(null, user);
    }
    catch (err) {
        done(err, false);
    }
})));
// Config passport Local strategy
passport_1.default.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // find the user given the email
        const user = yield user_model_1.default.findOne({ email });
        // if not, handle it
        if (!user) {
            return done(null, false, { message: 'Invalid credentials.' });
        }
        // check if the password is correct
        const isMatch = yield user.schema.methods.isValidPassword(user, password);
        // if not, handle it
        if (!isMatch) {
            return done(null, false, { message: 'Invalid credentials.' });
        }
        // otherwise, return the user
        done(null, user);
    }
    catch (err) {
        done(err, false);
    }
})));
const authenticationMiddleware = (req, res, next, authenticationType) => {
    passport_1.default.authenticate(authenticationType, { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(400).json(info);
        }
        req.user = user;
        next();
    })(req, res, next);
};
// authentication methods
exports.passportMiddlewareLocal = (req, res, next) => {
    authenticationMiddleware(req, res, next, 'local');
};
exports.passportMiddlewareJwt = (req, res, next) => {
    authenticationMiddleware(req, res, next, 'jwt');
};
