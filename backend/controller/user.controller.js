const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const { JWT_SECRET } = require('../config/constants');

exports.signup = async (req, res) => {
  try {
    const { username, password, email, name, contactNumber } = req.body;
    const user = await User.create({ username, password, email, name, contactNumber });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    user.dataValues.token = token
    res.json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Logged in successfully', token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
