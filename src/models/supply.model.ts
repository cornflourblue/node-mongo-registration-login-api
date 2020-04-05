import { Schema, Model, model, Mongoose } from 'mongoose';
import ISupply from '../interfaces/supply.interface';

// Schema
const supplySchema = new Schema({
  id: {
    type: String,
    required: '{PATH} is required',
    unique: true
  },
  name: {
    type: String,
    required: '{PATH} is required'
  },
  description: {
    type: String,
    required: '{PATH} is required'
  },
  observation: {
    type: String,
    required: '{PATH} is required'
  },
  unity: {
    type: String,
    required: '{PATH} is required'
  },
  supplyArea:{
    type: Schema.Types.ObjectId,
    ref: 'SupplyArea',
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now
  },
  updatedAt: Date,
});

// Model
const Supply: Model<ISupply> = model<ISupply>('Supply', supplySchema);


export default Supply;