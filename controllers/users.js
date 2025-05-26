const Router = require('koa-router');
const uuidv4 = require('uuid/v4');

const logger = require('../helpers/get-logger')(__filename);

const validateToken = require('../middlewares/validate-token');
const allowAccessForRoles = require('../middlewares/allow-access-for-roles');
const getNotUndefinedValues = require('../helpers/get-not-undefined-values');
const { ERROR_MESSAGES, ERROR_CODES } = require('../constants');
const Users = require('../models/users');
const Roles = require('../models/roles');

const router = new Router();

async function get(ctx) {
  const { method } = ctx.request;

  logger.info(method, '/');

  const users = await Users.getAllWithRoles();

  ctx.body = users;
}

async function getById(ctx) {
  const { method } = ctx.request;

  const userId = ctx.checkParams('uuid').notBlank().value;

  logger.info(method, '/', `user_id: ${userId}`);

  const user = await Users.get(userId);

  if (user === undefined) {
    ctx.throw(404, ERROR_MESSAGES.REQUEST_USER_NOT_FOUND, {
      code: ERROR_CODES.REQUEST_USER_NOT_FOUND
    });
  }

  delete user.password;

  ctx.body = user || {};
}

async function post(ctx) {
  const { method } = ctx.request;

  const roles = await Roles.getAll();

  const email = ctx.checkBody('email').notEmpty().isEmail().len(0, 255).value;
  const pass = ctx.checkBody('password').notEmpty().len(8, 255).sha1().value;
  const roleId = ctx.checkBody('role_id').notEmpty().isIn(roles.map(role => role.id)).value;

  ctx.assert(!ctx.errors, 400);

  logger.info(method, '/', `email: ${email}`, `password: ${pass}`, `role_id: ${roleId}`);

  const userID = uuidv4();

  await Users.insert({
    id: userID,
    email,
    password: pass,
    role_id: roleId
  });

  ctx.body = {
    user_id: userID
  };
}

async function put(ctx) {
  const { method } = ctx.request;

  const userId = ctx.checkParams('uuid').notBlank().value;
  const roles = await Roles.getAll();
  const pass = ctx.checkBody('password').optional().len(8, 255).sha1().value;
  const user = {
    email: ctx.checkBody('email').optional().isEmail().len(0, 255).value,
    role_id: ctx.checkBody('role_id').optional().isIn(roles.map(role => role.id)).value
  };

  if (pass) {
    user.password = pass;
  }

  ctx.assert(!ctx.errors, 400);

  logger.info(method, `/${userId}`, `email: ${user.email}`, `role_id: ${user.roleId}`);

  const updateParams = getNotUndefinedValues(user);

  const affectedRows = await Users.update(userId, updateParams);

  if (affectedRows === 0) {
    ctx.throw(404, ERROR_MESSAGES.REQUEST_USER_NOT_FOUND, {
      code: ERROR_CODES.REQUEST_USER_NOT_FOUND
    });
  }

  ctx.body = {};
}

async function del(ctx) {
  const { method } = ctx.request;

  const userId = ctx.checkParams('uuid').notBlank().value;

  logger.info(method, '/', `uuid: ${userId}`);

  await Users.delete(userId);

  ctx.body = {};
}

router
  .get('/', validateToken('login'), get)
  .get('/:uuid', validateToken('login'), getById)
  .post('/', validateToken('login'), allowAccessForRoles(['admin']), post)
  .put('/:uuid', validateToken('login'), allowAccessForRoles(['admin']), put)
  .del('/:uuid', validateToken('login'), allowAccessForRoles(['admin']), del);

module.exports = router;
