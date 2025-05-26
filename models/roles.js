const { SQL_TABLES } = require('../constants');
const BaseModel = require('./base');

const TABLE_NAME = SQL_TABLES.ROLES;

class Roles {
  static async get(id) {
    return BaseModel.get(TABLE_NAME, id);
  }

  static async getBy(field, value) {
    return BaseModel.getBy(TABLE_NAME, field, value);
  }

  static async getAll(limit = 50) {
    return BaseModel.getAll(TABLE_NAME, limit);
  }

  static async insert(values) {
    return BaseModel.insert(TABLE_NAME, values);
  }

  static async update(id, values) {
    return BaseModel.update(TABLE_NAME, id, values);
  }

  static async delete(id) {
    return BaseModel.delete(TABLE_NAME, id);
  }
}

module.exports = Roles;
