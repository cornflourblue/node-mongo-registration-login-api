import { Schema, Model, model } from 'mongoose';
import IPrescription from '../interfaces/prescription.interface';
import { supplySchema } from '../models/supply.model';
import { patientSchema } from '../models/patient.model';

// Schema
const prescriptionSchema = new Schema({
  patient_embbeded: patientSchema,
  professional: {
    userId: Schema.Types.ObjectId,
    businessName: { type: String, required: true },
    cuil: { type: String },
    enrollment: { type: String},
  },
  dispensedBy_embedded: {
    userId: Schema.Types.ObjectId,
    businessName: { type: String },
    cuil: { type: String },
  },
  dispensedAt: { type: Date },
  supplies_embedded: [{
    _id: false,
    supply: supplySchema,
    quantity: Number
  }],
  status: {
    type: String,
    enum: ['Pendiente', 'Dispensada'],
    default: 'Pendiente'
  },
  date: {
    type: Date,
    default: Date.now,
    required: '{PATH} is required'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date,
  observation: {
    type: String,
  },
  // production fields (deprecated)
  professionalFullname: {
    type: String,
  },
  dispensedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  supplies: [
    {
      supply:{
        type: Schema.Types.ObjectId,
        ref: "Supply"
      },
      quantity:{
        type: Number,
        required: '{PATH} is required'
      }
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: '{PATH} is required'
  },
  patient: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: '{PATH} is required'
  },

});

prescriptionSchema.index({user: 1, createdAt: 1}, {unique: true});

// Model
const Prescription: Model<IPrescription> = model<IPrescription>('Prescription', prescriptionSchema);

export default Prescription;
