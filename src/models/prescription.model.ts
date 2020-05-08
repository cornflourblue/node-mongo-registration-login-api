import { Schema, Model, model } from 'mongoose';
import IPrescription from '../interfaces/prescription.interface';
import { supplySchema } from '../models/supply.model';
import { patientSchema } from '../models/patient.model';

// Schema
const prescriptionSchema = new Schema({
  patient: patientSchema,
  professional: {
    userId: Schema.Types.ObjectId,
    businessName: { type: String, required: true },
    cuil: { type: String },
    enrollment: { type: String},
  },
  dispensedBy: {
    userId: Schema.Types.ObjectId,
    businessName: { type: String },
    cuil: { type: String },
  },
  dispensedAt: { type: Date },
  supplies: [{
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
  professionalFullname_deprecated: {
    type: String,
  },
  dispensedBy_deprecated: {
    type: Schema.Types.ObjectId,
    ref: "User"
  },
  supplies_deprecated: [
    {
      supply:{
        type: Schema.Types.ObjectId,
        ref: "Supply"
      },
      quantity:{
        type: Number,
      }
    }
  ],
  user_deprecated: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  patient_deprecated: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
  },

});

prescriptionSchema.index({user: 1, createdAt: 1}, {unique: true});

// Model
const Prescription: Model<IPrescription> = model<IPrescription>('Prescription', prescriptionSchema);

export default Prescription;
