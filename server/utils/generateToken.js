const jwt = require("jsonwebtoken");
const secretKey = process.env.JWT_SECRET;
const generateToken = (id) => {
  const payload = { userId: id };
  const tokenOptions = { expiresIn: '1d' };
  return jwt.sign(payload, secretKey, tokenOptions);
};

module.exports = generateToken;