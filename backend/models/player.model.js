import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
  },
  cash: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
  },
});

export default mongoose.model("Player", PlayerSchema);
