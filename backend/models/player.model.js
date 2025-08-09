import mongoose from "mongoose";
import bcrypt from "bcrypt";

const PlayerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  cash: {
    type: Number,
    required: true,
    default: 10000,
  },
  portfolio: [
    {
      ticker: String,
      quantity: Number,
    },
  ],
});


PlayerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});


PlayerSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("Player", PlayerSchema);
