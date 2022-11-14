const jwt = require('jsonwebtoken');

async function signToken (userDetails) {
  try {
    const accessToken = await jwt.sign(userDetails, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7 days' });
    return accessToken
  } catch (err) {
    throw err;
  }
}

async function verifyToken (req) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]
    const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    return user;
  } catch (err) {
    throw err;
  }
}

module.exports = {
  signToken,
  verifyToken
}