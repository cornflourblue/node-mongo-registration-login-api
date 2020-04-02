"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const passportConfig_1 = require("../middlewares/passportConfig");
class IndexRoutes {
    constructor() {
        this.router = express_1.Router();
        this.routes();
    }
    routes() {
        this.router.post('/signup', authController_1.default.signUp);
        this.router.post('/signin', passportConfig_1.passportMiddlewareLocal, authController_1.default.signIn);
        this.router.get('/profile', passportConfig_1.passportMiddlewareJwt, authController_1.default.profile);
    }
}
const indexRoutes = new IndexRoutes();
exports.default = indexRoutes.router;
