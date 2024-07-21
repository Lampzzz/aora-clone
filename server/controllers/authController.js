import bcrypt from "bcrypt";
import User from "../models/users.js";

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    await newUser.save();

    return res.status(200).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
