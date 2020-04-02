"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema
const patientSchema = new mongoose_1.Schema({
    dni: {
        type: String
    },
    last_name: {
        type: String
    },
    first_name: {
        type: Number
    },
    sex: {
        type: Number
    },
    image: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: Date,
});
// Model
const Patient = mongoose_1.model('Patient', patientSchema);
exports.default = Patient;
