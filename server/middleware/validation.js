import { checkSchema, validationResult } from "express-validator";

export const validateRegisterfdfd = checkSchema({
  username: {
    trim: true,
    notEmpty: {
      errorMessage: "Username is required",
    },
    isLength: {
      options: { min: 3 },
      errorMessage: "Username must contain at least 3 characters",
    },
  },
  email: {
    trim: true,
    isEmail: {
      errorMessage: "Valid email is required",
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
  },
});

export const validateRegister = (req, res, next) => {
  checkSchema({
    username: {
      trim: true,
      notEmpty: {
        errorMessage: "Username is required",
      },
      isLength: {
        options: { min: 3 },
        errorMessage: "Username must contain at least 3 characters",
      },
    },
    email: {
      trim: true,
      isEmail: {
        errorMessage: "Valid email is required",
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
    },
  });

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ errors: errors.array({ onlyFirstError: true }) });
  }
  next();
};
