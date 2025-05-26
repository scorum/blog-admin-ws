const Promise = require('bluebird');

exports.up = async function up(db) {
  return Promise.all([
    db.createTable('settings', {
      id: { type: 'int', primaryKey: true, autoIncrement: true }
    }),
    db.createTable('roles', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      name: { type: 'string', length: 100, unique: true, notNull: true },
      description: { type: 'string', length: 100, notNull: true }
    })
  ]).then(() =>
    db.createTable('users', {
      id: { type: 'string', length: 36, primaryKey: true, notNull: true },
      email: { type: 'string', length: 100, unique: true, notNull: true },
      password: { type: 'string', length: 100, notNull: true },
      role_id: {
        type: 'int',
        length: 10,
        notNull: true,
        foreignKey: {
          name: 'users_role_id_fk',
          table: 'roles',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      created_at: {
        type: 'timestamp',
        notNull: true,
        defaultValue: String('CURRENT_TIMESTAMP')
      },
      updated_at: { type: 'timestamp', notNull: false }
    })
  );
};

exports.down = function down(db) {
  return Promise.all([db.dropTable('settings'), db.dropTable('users')]).then(db.dropTable('roles'));
};

exports._meta = {
  version: 1
};
