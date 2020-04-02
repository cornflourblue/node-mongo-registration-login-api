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
const patient_model_1 = __importDefault(require("../models/patient.model"));
class PatientController {
    constructor() {
        this.getPatients = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const patients = yield patient_model_1.default.find();
            return res.status(200).json({ patients });
        });
        this.getPatientByDni = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const patient = yield patient_model_1.default.findOne({ _id: id });
                return res.status(200).json(patient);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json('Server Error');
            }
        });
        this.createPatient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { dni, last_name, first_name, sex, image } = req.body;
            const newPatient = new patient_model_1.default({
                dni,
                last_name,
                first_name,
                sex,
                image
            });
            try {
                yield newPatient.save();
                return res.status(200).json({ newPatient });
            }
            catch (err) {
                console.log(err);
                return res.status(500).json('Server Error');
            }
        });
        this.updatePatient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { dni, last_name, first_name, sex, image } = req.body;
                yield patient_model_1.default.findByIdAndUpdate(id, {
                    dni,
                    last_name,
                    first_name,
                    sex,
                    image
                });
                const patient = yield patient_model_1.default.findOne({ _id: id });
                return res.status(200).json(patient);
            }
            catch (err) {
                console.log(err);
                return res.status(500).json('Server Error');
            }
        });
        this.deletePatient = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield patient_model_1.default.findByIdAndDelete(id);
                return res.status(200).json('deleted');
            }
            catch (err) {
                console.log(err);
                return res.status(500).json('Server Error');
            }
        });
    }
}
exports.default = new PatientController();
