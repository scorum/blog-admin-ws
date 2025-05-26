const { ERROR_MESSAGES, ERROR_CODES } = require('../constants');

const allowAccessForRoles = (roles = ['admin']) => async (ctx, next) => {
  const { user } = ctx.state;

  ctx.assert(roles.includes(user.role), 403, ERROR_MESSAGES.REQUEST_ACCESS_NOT_ALLOW, {
    code: ERROR_CODES.REQUEST_ACCESS_NOT_ALLOW
  });

  await next();
};

module.exports = allowAccessForRoles;
