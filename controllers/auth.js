const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors"); //we have index js over there then we dont need  add the file name
const crypto = require("crypto"); //its built in function in node js for creating a buffer of random bytes

const register = async (req, res) => {
  // const user = await User.create({...req.body});
  const { name, email, password,role } = req.body;

  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }

  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }

  // // create user verification token
  // const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      lastName: user.lastName,
      location: user.location,
      name: user.name,
      role: user.role,
    },
    token,
    location: user.location,
  });
};

// login user
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  //compare password using bcrypt
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("The email or the password does not match");
  }

  //else if user exist then lets create a token
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

// upadate user
const updateUser = async (req, res) => {
  const { email, name, lastName, location } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;
  // console.log(user);

  await user.save();

  const token = user.createJWT();
  console.log("user", user, token);
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};

module.exports = {
  register,
  login,
  updateUser,
};
