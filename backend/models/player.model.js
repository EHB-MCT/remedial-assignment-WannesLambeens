import mongoose from "mongoose";

const { Schema, model } = mongoose;

const PlayerSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  cash: {
    type: mongoose.Schema.Types.Decimal128,
    required: true,
    default: "100000.00",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model("Player", PlayerSchema);
