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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const JWT = __importStar(require("jsonwebtoken"));
const passport_1 = __importDefault(require("../config/passport"));
const user_model_1 = __importDefault(require("../models/user.model"));
class AuthController {
    constructor() {
        this.signUp = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { username, email, password } = req.body;
            const newUser = new user_model_1.default({ username, email, password });
            try {
                yield newUser.save();
                return res.json({
                    msg: "Sign up successfully!",
                    newUser
                });
            }
            catch (e) {
                return res.json(e.errors).status(422);
            }
        });
        this.signIn = (req, res) => {
            const user = req.user;
            const token = this.signInToken(user);
            return res.status(200).json({
                msg: 'User sign in successfully!',
                token
            });
        };
        this.profile = (req, res) => {
            const { username, email } = req.user;
            return res.json({
                msg: "profile",
                username,
                email
            });
        };
        this.signInToken = (user) => {
            return JWT.sign({
                iss: "naapi",
                sub: user._id,
                iat: new Date().getTime(),
                exp: new Date().setDate(new Date().getDate() + 1)
            }, passport_1.default.JWT_SECRET);
        };
    }
}
exports.default = new AuthController();
