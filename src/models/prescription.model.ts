import { Schema, Model, model } from 'mongoose';
import IPrescription from '../interfaces/prescription.interface';

// Schema
const prescriptionSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: '{PATH} is required'
  },
  patientId: {
    type: String,
    ref: "Patient",
    required: '{PATH} is required'
  },
  supplies: [
    {
      type: Schema.Types.ObjectId,
      ref: "Supply"
    }
  ],
  status: {
    type: String,
    enum: ['Pendiente', 'Dispensada'],
    default: 'Pendiente'
  },
  professionalFullname: {
    type: String,
  },
  dispensedBy: {
    type: Schema.Types.ObjectId,
    ref: "User"
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
});

prescriptionSchema.index({user: 1, createdAt: 1}, {unique: true});

// Model
const Prescription: Model<IPrescription> = model<IPrescription>('Prescription', prescriptionSchema);

export default Prescription;
