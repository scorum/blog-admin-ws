const moment = require('moment');
const logger = require('../helpers/get-logger')(__filename);
const { SQL_TABLES } = require('../constants');
const ResponseError = require('../libs/ResponseError');
const BaseModel = require('./base');

const TABLE_NAME = SQL_TABLES.USERS;

class Users {
  static async get(id) {
    try {
      const sql = `
        SELECT u.id as id, email, password, role_id, r.name as role
        FROM users as u
        LEFT JOIN roles as r ON u.role_id = r.id
        WHERE u.id = ?
      `;

      const records = await global.db.queryAsync(sql, [id]);
      const record = records[0];

      return record;
    } catch (e) {
      logger.error(`${TABLE_NAME}.get`, e);
      throw new ResponseError(e.message, 500);
    }
  }

  static async getBy(field, value) {
    try {
      const sql = `
        SELECT u.id as id, email, password, role_id, r.name as role
        FROM users as u
        LEFT JOIN roles as r ON u.role_id = r.id
        WHERE ${field} = ?
      `;

      const records = await global.db.queryAsync(sql, [value]);

      return records;
    } catch (e) {
      logger.error(`${TABLE_NAME}.getBy`, e);
      throw new ResponseError(e.message, 500);
    }
  }

  static async getAll(limit = 50) {
    return BaseModel.getAll(TABLE_NAME, limit);
  }

  static async getAllWithRoles(limit = 50) {
    try {
      const sql = `
        SELECT u.id, email, role_id, r.description as role
        FROM users as u
        LEFT JOIN roles as r ON u.role_id = r.id
        LIMIT ${limit}
      `;

      const records = await global.db.queryAsync(sql);

      return records;
    } catch (e) {
      logger.error(`${TABLE_NAME}.getAll`, e);
      throw new ResponseError(e.message, 500);
    }
  }

  static async insert(values) {
    return BaseModel.insert(TABLE_NAME, values);
  }

  static async update(id, values) {
    const _values = Object.assign({}, values, {
      updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
    });

    return BaseModel.update(TABLE_NAME, id, _values);
  }

  static async delete(id) {
    return BaseModel.delete(TABLE_NAME, id);
  }
}

module.exports = Users;
