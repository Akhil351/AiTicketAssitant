import monogoose from "mongoose";

const userSchema = new monogoose.Schema({
  email: { type: String, required: true, unique: True },
  password: { type: String, required: true },
  role: {
    type: String,
    default: "user",
    enum: ["user", "moderator", "admin"],
  },
  skills: [String],
  createdAt: { type: Date, default: Date.now },
});

const User = monogoose.model("User", userSchema);

export default User;
