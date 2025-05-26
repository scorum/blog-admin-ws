const jwt = require('jsonwebtoken');

const { JWT_EXPIRES_IN } = require('../constants');

module.exports = function getJWTToken(data, expiresIn = JWT_EXPIRES_IN) {
  return jwt.signAsync(data, process.env.JWT_SECRET, { expiresIn });
};
