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
const mongoose_1 = require("mongoose");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Validation callbacks
const uniqueEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ email });
    return !user;
});
const validEmail = (email) => {
    var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email);
};
// Setter
const encryptPassword = (password) => {
    const salt = bcryptjs_1.default.genSaltSync(10);
    const passwordDigest = bcryptjs_1.default.hashSync(password, salt);
    return passwordDigest;
};
// Schema
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        set: encryptPassword
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
});
// Model
const User = mongoose_1.model('User', userSchema);
// Model methods
User.schema.method('isValidPassword', function (thisUser, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield bcryptjs_1.default.compare(password, thisUser.password);
        }
        catch (err) {
            throw new Error(err);
        }
    });
});
// Model Validations
User.schema.path('email').validate(uniqueEmail, 'This email address is already registered');
User.schema.path('email').validate(validEmail, 'The e-mail field most be type of email.');
exports.default = User;
