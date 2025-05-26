require('../helpers/env');
const args = require('yargs').argv;

const uuidv4 = require('uuid/v4');
const crypto = require('crypto');

const mysql = require('../libs/mysql');

const logger = require('../helpers/get-logger')(__filename);

async function roles() {
  const connection = await mysql.getConnection();

  try {
    await connection.queryAsync('INSERT INTO roles SET ? ', { name: 'admin', description: 'admin' });
  } catch (err) {
    logger.error(err);
  }

  connection.release();
}

async function user(roleId, email, pass) {
  const connection = await mysql.getConnection();

  let role = roleId;
  if (roleId === 0) {
    const [raw] = await connection.queryAsync('SELECT id FROM roles LIMIT 1');
    role = raw.id;
  }

  try {
    await connection.queryAsync('INSERT INTO users SET ? ', {
      id: uuidv4(),
      email,
      password: crypto.createHash('sha1').update(pass).digest('hex'),
      role_id: role
    });
  } catch (err) {
    logger.error(err);
  }

  connection.release();
}

function help() {
  console.log(`
  seed.js --type [type]

  types:

    roles
    user --role_id [role id] --email [email] --pass [pass]

  Example: seed.js --type role
  `);
}

async function init() {
  const type = args.type;

  switch (type) {
    case 'roles':
      await roles();
      break;
    case 'user':
      await user(args.role_id || 0, args.email || 'admin@mail.com', args.pass || 'password');
      break;

    default:
      help();
  }
}

logger.info('Start...');
init()
  .then(() => {
    logger.info('Finish...');
    process.exit(0);
  })
  .catch((err) => {
    logger.error(err);

    process.exit(1);
  });
