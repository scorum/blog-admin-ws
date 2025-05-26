const Router = require('koa-router');

const logger = require('../helpers/get-logger')(__filename);
const getJWTToken = require('../helpers/get-jwt-token');
const validateUserCreds = require('../middlewares/validate-user-creds');

const { ERROR_MESSAGES, ERROR_CODES } = require('../constants');
const Users = require('../models/users');

const router = new Router();

async function post(ctx) {
  const { method } = ctx.request;
  const { email, pass } = ctx.state;

  logger.info(method, '/', `pass: ${pass}`, `email: ${email}`);

  const [user] = await Users.getBy('email', email);

  ctx.assert(user, 401, ERROR_MESSAGES.REQUEST_INVALID_CREDENTIALS, {
    code: ERROR_CODES.REQUEST_INVALID_CREDENTIALS
  }); // user not found

  ctx.assert(user.password === pass, 401, ERROR_MESSAGES.REQUEST_INVALID_CREDENTIALS, {
    code: ERROR_CODES.REQUEST_INVALID_CREDENTIALS
  }); // wrong pass

  const accessToken = await getJWTToken({ user_id: user.id, type: 'login' });

  ctx.body = {
    id: user.id,
    role: user.role,
    access_token: accessToken
  };
}

router.post('/', validateUserCreds, post);

module.exports = router;
