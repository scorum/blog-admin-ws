const Router = require('koa-router');

const health = require('./controllers/health');
const version = require('./controllers/version');
const authorization = require('./controllers/authorization');
const users = require('./controllers/users');
const roles = require('./controllers/roles');
const blacklist = require('./controllers/blacklist');
const whitelist = require('./controllers/whitelist');
const categories = require('./controllers/categories');

const validatePrivateUUID = require('./middlewares/validate-private-uuid');

const router = new Router();

router
  .use('/:privateUUID/health', validatePrivateUUID(), health.routes(), health.allowedMethods())
  .use('/:privateUUID/version', validatePrivateUUID(), version.routes(), version.allowedMethods())
  .use('/authorization', authorization.routes(), authorization.allowedMethods())
  .use('/users', users.routes(), users.allowedMethods())
  .use('/roles', roles.routes(), roles.allowedMethods())
  .use('/blacklist', blacklist.routes(), blacklist.allowedMethods())
  .use('/whitelist', whitelist.routes(), whitelist.allowedMethods())
  .use('/categories', categories.routes(), categories.allowedMethods());

module.exports = router;
