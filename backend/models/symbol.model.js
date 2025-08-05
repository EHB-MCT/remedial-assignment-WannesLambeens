import mongoose from "mongoose";

const SymbolSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  freeFloat: {
    type: mongoose.Schema.Types.Decimal128,
    required: false,
  },
  tickSize: {
    type: mongoose.Schema.Types.Decimal128,
    required: false,
  },
});

export default mongoose.model("Symbol", SymbolSchema);
