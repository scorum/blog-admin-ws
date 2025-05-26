# API for blog/admin

  * Based on the Koa2
  * Has a promisifyed MySQL lib with pool of connections
  * Has MySQL migrations
  * Has MySQL seeds
  * Has .env file for the environment specific settings
  * Has ESLint and Prettier integration
  * Has the private /:privateUUID/health and /:privateUUID/version routes
  * Has a middleware to validate the errors in the one place
  * Has a pretty logger with date time, file path and colors

## Installation

Just clone the repository:

```
git clone git@github.com:scorum/blog-admin-ws.git
```

## Usage

### `.env` and `.env.default` files

The service uses `.env` file for the environment specific settings(HTTP port, MySQL pass, MySQL username and etc).
We are using [dotenv](https://www.npmjs.com/package/dotenv) lib to move variables from `.env` file to the `process.env`.
`.env` file added to `.gitignore` to be sure not putting private data into the repository.
`.env.default` this is template file for the developers and DevOps team to generate `.env` file with the right keys.

#### `.env.default` structure

```
# ENVIRONMENT SETTINGS
NODE_ENV = "development"
HTTP_PORT = 3011
ALLOW_ORIGIN = "*"
HEALTH_UUID = ""

JWT_SECRET = ""

# Database
DB_HOST = ""
DB_NAME = ""
DB_PORT =

DB_HOST = ""
DB_PORT =
DB_USER = ""
DB_PASS = ""
DB_NAME = ""
DB_CONNECTION_LIMIT = 10

REDIS_DB = ""
REDIS_HOST = ""
REDIS_PORT = ""
```

##### By default (look into `/helpers/env.js` file) `NODE_ENV` variable will be `production` to disable development logs and switch `koa` to the production mode. To override it just add `NODE_ENV=development` to your local or dev `.env` file.

### ESLint and Prettier

For [eslint](https://eslint.org/) we are using the following configs: `airbnb-base` and plugings: `prettier`.

We are using [prettier](https://prettier.io/) for pretty code style in the team.

To run eslint use the following command:

```
npm run lint
```

### Logger

We are using [Winston](https://github.com/winstonjs/winston) lib for the logs with some additional features.
To get logger just include the `get-logger` file from the `helpers` folder to your file and pass the prefix to the `getLogger` function. We reccomend to use the `__filename` for the prefix.

Example:

```
const logger = require('./helpers/get-logger')(__filename);

/*
 ...
*/

logger.info('App started successfully on the port %s', process.env.HTTP_PORT); // [2018-04-11T13:13:21.633Z] [info] /path/to/your/file.js - App started successfully on the port 3011
```

#### Log levels

* `.warn` - yellow color
* `.error` - red color
* `.debug` - grey color
* `.info` - green color

### MySQL lib

To connect to the MySQL server we are using [MySQL driver](https://github.com/mysqljs/mysql).
To access MySQL connection instance from the routes you can use koa's state. Example:

```
const now = await ctx.state.db.query('SELECT NOW()');
```

Also, you can get new MySQL connection instance from the pool. Example:

```
const mysql = require('./libs/mysql');

/* .... */

const db = await mysql.getConnection();
```

#### MySQL lib API

* `.getConnection` - gets new promisifyed connection instance(you can use `.queryAsync` instead of `.query`), returns Promise
* `.end` - closes all connections, returns Promise

### MySQL migrations

For MySQL migrations we are using [db-migrate](https://db-migrate.readthedocs.io/en/latest/) lib. To start migrations just run the following command:

```
npm run migrate
```

You create new migration with the following command `db-migrate create filename`.

##### NOTE: Please read the [db-migrate](https://db-migrate.readthedocs.io/en/latest/) doc!

### MySQL seeds

```
node ./helpers/seeds.js
```


### Routes

For routing we using [koa-router](https://github.com/alexmingoia/koa-router) and for validation [koa-validate](https://github.com/RocksonZeta/koa-validate) libs. All routes placed in the `/controllers` folder and the main router is `/router.js`.

By default router has two private routes:

* `/:privateUUID/health` - the health information for this service
* `/:privateUUID/version` - the current version of the service

To access this router user needs to know `HEALTH UUID` set in the `.env` file.
