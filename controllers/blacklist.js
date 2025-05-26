const Router = require('koa-router');
const scorumSide = require('@scorum/scorum-side-js');

const logger = require('../helpers/get-logger')(__filename);

const validateToken = require('../middlewares/validate-token');
const allowAccessForRoles = require('../middlewares/allow-access-for-roles');

const router = new Router();

scorumSide.api.setOptions({ url: process.env.SIDE_RPC_URL });
scorumSide.config.set('chain_id', process.env.CHAIN_ID);
scorumSide.config.set('address_prefix', 'SCR');

async function post(ctx) {
  const { method } = ctx.request;

  const account = ctx.checkBody('account').notEmpty().value;
  const permlink = ctx.checkBody('permlink').notEmpty().value;

  ctx.assert(!ctx.errors, 400);

  logger.info(method, '/', `account: ${account}`, `permlink: ${permlink}`);

  await scorumSide.broadcast.addToBlacklistAdminAsync(process.env.ADMIN_PRIVATE_KEY, process.env.ADMIN_USERNAME, account, permlink);

  ctx.body = {};
}

async function del(ctx) {
  const { method } = ctx.request;

  const account = ctx.checkParams('account').notEmpty().value;
  const permlink = ctx.checkParams('permlink').notEmpty().value;

  logger.info(method, '/', `account: ${account}`, `permlink: ${permlink}`);

  await scorumSide.broadcast.removeFromBlacklistAdminAsync(process.env.ADMIN_PRIVATE_KEY, process.env.ADMIN_USERNAME, account, permlink);

  ctx.body = {};
}

router
  .post('/', validateToken('login'), allowAccessForRoles(['admin']), post)
  .del('/:account/:permlink', validateToken('login'), allowAccessForRoles(['admin']), del);

module.exports = router;
