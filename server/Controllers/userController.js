const userModel = require('../Models/userModel');
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const createToken = (_id, email) => {
  const jwtkey = process.env.JWT_SECRET_KEY;

  return jwt.sign({ _id, email }, jwtkey, { expiresIn: '3d' });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (user)
      return res.status(400).json('User with the given email already exists.');

    if (!name || !email || !password)
      return res.status(400).json('All fields are required.');

    if (!validator.isEmail(email))
      return res
        .status(400)
        .json('Email is not valid. Plese, check yoour email.');

    if (!validator.isStrongPassword(password))
      return res.status(400).json('Password is not strong enough.');

    user = new userModel({ name, email, password });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = createToken(user._id, email);

    res.status(200).json({ _id: user._id, name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) return res.status(400).json('Invalid email or password.');

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(400).json('Invalid email or password.');

    const token = createToken(user._id, email);

    res.status(200).json({ _id: user._id, name: user.name, email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUser = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.params.userId)
      .select('-password');

    if (!user) return res.status(404).json({ message: 'User not found.' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Find User Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await userModel.find().select('-password').lean();

    if (!users.length)
      return res.status(404).json({ message: 'No users found.' });

    res.status(200).json(users);
  } catch (error) {
    console.error('Get Users Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  findUser,
  getUsers,
};
