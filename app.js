const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const helmet = require('koa-helmet');
const validate = require('koa-validate');
const scorumSide = require('@scorum/scorum-side-js');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');

const router = require('./router');

const requests = require('./middlewares/requests');
const errors = require('./middlewares/errors');
const addDBToState = require('./middlewares/add-db-to-state');

Promise.promisifyAll(jwt);

const app = new Koa();
app.env = process.env.NODE_ENV;

scorumSide.api.setOptions({ url: process.env.SIDE_RPC_URL });
scorumSide.config.set('chain_id', process.env.CHAIN_ID);
scorumSide.config.set('address_prefix', 'SCR');

app.use(requests());

validate(app);

app.use(errors());
app.use(cors({ origin: process.env.ALLOW_ORIGIN }));
app.use(bodyParser());
app.use(helmet());
app.use(addDBToState());

app.use(router.routes());
app.use(router.allowedMethods());

module.exports = app;
