const Router = require('koa-router');
const scorumSide = require('@scorum/scorum-side-js');

const logger = require('../helpers/get-logger')(__filename);

const validateToken = require('../middlewares/validate-token');
const allowAccessForRoles = require('../middlewares/allow-access-for-roles');

const router = new Router();

async function post(ctx) {
  const { method } = ctx.request;

  const account = ctx.checkBody('account').notEmpty().value;

  ctx.assert(!ctx.errors, 400);

  logger.info(method, '/', `account: ${account}`);

  await scorumSide.broadcast.setAccountTrustedAdminWithAsync(process.env.ADMIN_PRIVATE_KEY, {
    account: process.env.ADMIN_USERNAME,
    blog_account: account,
    is_trusted: true
  });

  ctx.body = {};
}

async function del(ctx) {
  const { method } = ctx.request;

  const account = ctx.checkParams('account').notEmpty().value;

  ctx.assert(!ctx.errors, 400);

  logger.info(method, '/', `account: ${account}`);

  await scorumSide.broadcast.setAccountTrustedAdminWithAsync(process.env.ADMIN_PRIVATE_KEY, {
    account: process.env.ADMIN_USERNAME,
    blog_account: account,
    is_trusted: false
  });

  ctx.body = {};
}

router
  .post('/', validateToken('login'), allowAccessForRoles(['admin']), post)
  .del('/:account', validateToken('login'), allowAccessForRoles(['admin']), del);

module.exports = router;
