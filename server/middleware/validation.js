import { checkSchema, validationResult } from "express-validator";
import User from "../models/users.js";

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
      options: { min: 8 },
      errorMessage: "Password must be at least 8 characters long",
    },
    matches: {
      options: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      errorMessage:
        "Password must contain at least one uppercase letter, number, and special character",
    },
  },
  confirmPassword: {
    trim: true,
    notEmpty: {
      errorMessage: "Confirm password is required",
    },
    custom: {
      options: (value, { req }) => value === req.body.password,
      errorMessage: "Passwords do not match",
    },
  },
});

export const validateRegister = [
  registrationSchema,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array({ onlyFirstError: true }) });
    }
    next();
  },
];
