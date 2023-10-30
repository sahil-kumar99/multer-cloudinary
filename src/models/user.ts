import mongoose, { Schema } from "mongoose";

interface IUser {
  username: string;
  email: string;
  password: string;
  profile: string;
}

const userSchema = new Schema<IUser>({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profile: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
