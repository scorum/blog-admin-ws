const logger = require('../helpers/get-logger')(__filename);
const ResponseError = require('../libs/ResponseError');

class Model {
  static async get(tableName, id) {
    const records = await global.db.queryAsync(`SELECT * FROM \`${tableName}\` WHERE id = ?`, [id]);
    const record = records[0];
    return record;
  }

  static async getBy(tableName, field, value) {
    try {
      const sql = `SELECT * FROM \`${tableName}\` WHERE ${field} = ?`;

      const records = await global.db.queryAsync(sql, [value]);

      return records;
    } catch (e) {
      switch (e.code) {
        case 'ER_BAD_FIELD_ERROR':
          throw new ResponseError(`Unrecognised ${tableName} field ${field}`, 403);
        default:
          logger.error(`${tableName}.getBy`, e);
          throw new ResponseError(e.message, 500);
      }
    }
  }

  static async getAll(tableName, limit = 50) {
    try {
      const sql = `SELECT * FROM \`${tableName}\` LIMIT ${limit}`;

      const records = await global.db.queryAsync(sql);

      return records;
    } catch (e) {
      logger.error(`${tableName}.getAll`, e);
      throw new ResponseError(e.message, 500);
    }
  }

  static async insert(tableName, values) {
    try {
      let result;
      if (Object.keys(values).length === 0) {
        result = await global.db.queryAsync(`INSERT INTO \`${tableName}\` VALUES ()`);
      } else {
        result = await global.db.queryAsync(`INSERT INTO \`${tableName}\` SET ?`, [values]);
      }

      return result.insertId;
    } catch (e) {
      switch (e.code) {
        case 'ER_BAD_NULL_ERROR':
        case 'ER_NO_REFERENCED_ROW_2':
        case 'ER_NO_DEFAULT_FOR_FIELD':
          throw new ResponseError(e.message, 403); // Forbidden
        case 'ER_DUP_ENTRY':
          throw new ResponseError(e.message, 409); // Conflict
        case 'ER_BAD_FIELD_ERROR':
          throw new ResponseError(e.message, 500); // Internal Server Error for programming errors
        default:
          logger.error(`${tableName}.insert`, e);
          throw new ResponseError(e.message, 500); // Internal Server Error for uncaught exception
      }
    }
  }

  static async update(tableName, id, values) {
    try {
      const result = await global.db.queryAsync(`UPDATE \`${tableName}\` SET ? WHERE id = ?`, [values, id]);

      return result.affectedRows;
    } catch (e) {
      switch (e.code) {
        case 'ER_BAD_NULL_ERROR':
        case 'ER_ROW_IS_REFERENCED_2':
        case 'ER_NO_REFERENCED_ROW_2':
          throw new ResponseError(e.message, 403); // Forbidden
        case 'ER_DUP_ENTRY':
          throw new ResponseError(e.message, 409); // Conflict
        case 'ER_BAD_FIELD_ERROR':
          throw new ResponseError(e.message, 500); // Internal Server Error for programming errors
        default:
          logger.error(`${tableName}.update`, e);
          throw new ResponseError(e.message, 500); // Internal Server Error for uncaught exception
      }
    }
  }

  static async delete(tableName, id) {
    try {
      await global.db.queryAsync(`DELETE FROM  \`${tableName}\` WHERE id = ?`, [id]);
    } catch (e) {
      switch (e.code) {
        case 'ER_ROW_IS_REFERENCED_':
        case 'ER_ROW_IS_REFERENCED_2':
          throw new ResponseError(e.message, 403); // Forbidden
        default:
          logger.error(`${tableName}.delete`, e);
          throw new ResponseError(e.message, 500); // Internal Server Error
      }
    }
  }
}

module.exports = Model;
