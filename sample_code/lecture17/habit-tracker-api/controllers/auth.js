const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CustomAPIError = require('../errors');

function signToken(user) {
  return jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
}

// L11 only demoed /auth/login against a pre-seeded user. This app is
// standalone, so it also needs /auth/register — new code, so it hashes
// passwords with bcrypt rather than repeating L11's plaintext comparison.
async function register(req, res, next) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      throw new CustomAPIError('username and password are required', 400);
    }

    const existing = await User.findOne({ username });
    if (existing) {
      throw new CustomAPIError('Username already taken', 400);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: passwordHash });

    res.status(201).json({ token: signToken(user) });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      throw new CustomAPIError('Invalid credentials', 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomAPIError('Invalid credentials', 400);
    }

    res.json({ token: signToken(user) });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
