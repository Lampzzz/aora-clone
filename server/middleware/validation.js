import { checkSchema, validationResult } from "express-validator";
import User from "../models/users.js";
import bcrypt from "bcrypt";

const registrationSchema = checkSchema({
  username: {
    trim: true,
    notEmpty: {
      errorMessage: "Username is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Username must contain at least 3 characters",
    },
    custom: {
      options: async (value) => {
        const user = await User.findOne({ username: value });
        if (user) {
          return Promise.reject("Username already exists");
        }
      },
    },
  },
  email: {
    trim: true,
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Invalid Email Format",
    },
    custom: {
      options: async (value) => {
        const user = await User.findOne({ email: value });
        if (user) {
          return Promise.reject("Email already exists");
        }
      },
    },
  },
  password: {
    trim: true,
    notEmpty: {
      errorMessage: "Password is required",
    },
    isLength: {
      options: { min: 6 },
      errorMessage: "Password must be at least 6 characters long",
    },
  },
});

const loginSchema = checkSchema({
  email: {
    trim: true,
    notEmpty: {
      errorMessage: "Email is required",
    },
  },
  password: {
    trim: true,
    notEmpty: {
      errorMessage: "Password is required",
    },
  },
});

export const validateRegister = [
  registrationSchema,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array({ onlyFirstError: true }));
    }

    next();
  },
];

export const validateLogin = [
  loginSchema,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array({ onlyFirstError: true }));
    }
    next();
  },
];
