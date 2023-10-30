import mongoose, { Schema } from "mongoose";

interface IToken {
  userId: object;
  otp: number;
  createdAt: object;
}

const otpSchema = new Schema<IToken>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  otp: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: 120,
  },
});

const Otp = mongoose.model("Token", otpSchema);

export default Otp;
