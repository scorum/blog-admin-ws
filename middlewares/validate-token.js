const jwt = require('jsonwebtoken');

const { ERROR_MESSAGES, ERROR_CODES } = require('../constants');
const Users = require('../models/users');

const validateToken = (tokenType = 'login') => async (ctx, next) => {
  const token = ctx.checkHeader('x-auth-token').notEmpty().value;

  let data;

  try {
    data = await jwt.verifyAsync(token, process.env.JWT_SECRET);
  } catch (e) {
    ctx.throw(401, 'Failed to authenticate token.');
  }

  ctx.assert(tokenType === data.type, 401, ERROR_MESSAGES.REQUEST_INVALID_AUTH_TOKEN, {
    code: ERROR_CODES.REQUEST_INVALID_AUTH_TOKEN
  });

  const user = await Users.get(data.user_id);

  ctx.assert(user, 401, ERROR_MESSAGES.REQUEST_INVALID_AUTH_TOKEN, {
    code: ERROR_CODES.REQUEST_INVALID_AUTH_TOKEN
  });

  ctx.state.user = Object.assign({}, user);

  await next();
};

module.exports = validateToken;
