const Router = require('koa-router');
const scorumSide = require('@scorum/scorum-side-js');

const logger = require('../helpers/get-logger')(__filename);

const validateToken = require('../middlewares/validate-token');
const allowAccessForRoles = require('../middlewares/allow-access-for-roles');

const router = new Router();

scorumSide.api.setOptions({ url: process.env.SIDE_RPC_URL });
scorumSide.config.set('chain_id', process.env.CHAIN_ID);
scorumSide.config.set('address_prefix', 'SCR');

async function get(ctx) {
  const { method } = ctx.request;

  const domain = ctx.checkParams('domain').notEmpty().value;

  logger.info(method, '/', `domain: ${domain}`);

  const categories = await scorumSide.api.getCategoriesWithAsync({ domain });

  ctx.body = categories;
}

async function post(ctx) {
  const { method } = ctx.request;

  const domain = ctx.checkBody('domain').notEmpty().value;
  const label = ctx.checkBody('label').notEmpty().value;
  const localizationKey = ctx.checkBody('localization_key').notEmpty().value;

  ctx.assert(!ctx.errors, 400);

  logger.info(method, '/', `domain: ${domain}`, `label: ${label}`, `localization_key: ${localizationKey}`);

  await scorumSide.broadcast.addCategoryAdminWithAsync(process.env.ADMIN_PRIVATE_KEY, {
    account: process.env.ADMIN_USERNAME,
    domain,
    label,
    localization_key: localizationKey
  });

  ctx.body = {};
}

async function put(ctx) {
  const { method } = ctx.request;

  // from params
  const domain = ctx.checkParams('domain').notEmpty().value;
  const label = ctx.checkParams('label').notEmpty().value;

  // from body
  const order = ctx.checkBody('order').notEmpty().value;
  const localizationKey = ctx.checkBody('localization_key').notEmpty().value;

  logger.info(method, '/', `domain: ${domain}`, `label: ${label}`, `order: ${order}`, `localization_key: ${localizationKey}`);

  await scorumSide.broadcast.updateCategoryAdminWithAsync(process.env.ADMIN_PRIVATE_KEY, {
    account: process.env.ADMIN_USERNAME,
    domain,
    label,
    order,
    localization_key: localizationKey
  });

  ctx.body = {};
}

async function del(ctx) {
  const { method } = ctx.request;

  const domain = ctx.checkParams('domain').notEmpty().value;
  const label = ctx.checkParams('label').notEmpty().value;

  logger.info(method, '/', `domain: ${domain}`, `label: ${label}`);

  await scorumSide.broadcast.removeCategoryAdminWithAsync(process.env.ADMIN_PRIVATE_KEY, {
    account: process.env.ADMIN_USERNAME,
    domain,
    label
  });

  ctx.body = {};
}

router
  .get('/:domain', validateToken('login'), allowAccessForRoles(['admin']), get)
  .post('/', validateToken('login'), allowAccessForRoles(['admin']), post)
  .put('/:domain/:label', validateToken('login'), allowAccessForRoles(['admin']), put)
  .del('/:domain/:label', validateToken('login'), allowAccessForRoles(['admin']), del);

module.exports = router;
