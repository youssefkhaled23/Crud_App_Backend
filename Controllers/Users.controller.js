const asyncWrapper = require("../middlewares/asyncWrapper");
const StatusText = require("../utils/StatusText");
const appError = require("../utils/appError");
const Users = require("../Model/users.model");
const bcrypt = require("bcrypt");
const generateJWT = require("../utils/generateJwt");

// Controller for fetching users
const getAllUsers = asyncWrapper(async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const users = await Users.find(
    {},
    { __v: false, password: false, token: false }
  )
    .limit(parseInt(limit, 10))
    .skip((page - 1) * parseInt(limit, 10));
  res.status(200).json({ success: StatusText.SUCCESS, data: users });
});

// Registration Controller
const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;
  const oldUser = await Users.findOne({ email });
  if (oldUser) {
    const error = new appError("User already exists", 400, StatusText.FAIL);
    return next(error);
  }

  const hashingPassword = await bcrypt.hash(password, 10);
  const newUser = new Users({
    firstName,
    lastName,
    email,
    password: hashingPassword,
    role,
    avatar: req.file ? req.file.filename : null,
  });

  // Generate JWT after creating the user
  const token = generateJWT({
    email: newUser.email,
    id: newUser._id,
    role: newUser.role,
  });
  newUser.token = token;

  // Save the new user with token
  await newUser.save();

  res.status(201).json({
    success: StatusText.SUCCESS,
    data: { user: newUser },
  });
});

// Login Controller
const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await Users.findOne({ email });
  if (!user) {
    return next(new appError("User not found", 404, StatusText.FAIL));
  }

  if (!email || !password) {
    return next(
      new appError("Email and password are required", 400, StatusText.FAIL)
    );
  }

  // Compare password
  const matchedPassword = await bcrypt.compare(password, user.password);
  if (matchedPassword) {
    const token = generateJWT({
      email: user.email,
      id: user._id,
      role: user.role,
    });
    res.status(200).json({
      success: StatusText.SUCCESS,
      data: { message: "Logged in successfully", token: token },
    });
  } else {
    return next(
      new appError("Invalid email or password", 401, StatusText.FAIL)
    );
  }
});

// Export controllers
module.exports = {
  getAllUsers,
  register,
  login,
};
