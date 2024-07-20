import bcrypt from "bcrypt";
import User from "../models/users.js";

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = {
      username,
      email,
      password: passwordHash,
    };

    res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
  }
};
