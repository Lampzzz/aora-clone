import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },

  avatar: { type: String, required: true },

  registered: {
    type: String,
    required: true,
    default: new Date(),
  },
});

const User = mongoose.model("User", userSchema);

export default User;
