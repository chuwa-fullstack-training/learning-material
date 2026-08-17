const jwt = require('jsonwebtoken');

function requireJwt(req, res, next) {
  const token =
    req.header('x-auth-token') || req.headers?.authorization?.match(/^Bearer (.+)/)?.[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

module.exports = { requireJwt };
