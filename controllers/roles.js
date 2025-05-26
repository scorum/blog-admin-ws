const Router = require('koa-router');

const logger = require('../helpers/get-logger')(__filename);

const validateToken = require('../middlewares/validate-token');
const Roles = require('../models/roles');

const router = new Router();

async function get(ctx) {
  const { method } = ctx.request;

  logger.info(method, '/');

  const roles = await Roles.getAll();

  ctx.body = roles || [];
}

router.get('/', validateToken('login'), get);

module.exports = router;
