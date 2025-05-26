exports.JWT_EXPIRES_IN = '7d';

exports.HEALTH_STATUSES = {
  OK: 'ok',
  FAIL: 'fail'
};

exports.ERROR_CODES = {
  SERVER_ERROR: '001',

  REQUEST_INVALID_PRIVATE_UUID: '101',
  REQUEST_INVALID_CREDENTIALS: '102',
  REQUEST_INVALID_AUTH_TOKEN: '103',
  REQUEST_ACCESS_NOT_ALLOW: '105',
  REQUEST_USER_NOT_FOUND: '108'
};

exports.ERROR_MESSAGES = {
  SERVER_ERROR: 'there was a problem with handling your request, please try again later',

  REQUEST_INVALID_PRIVATE_UUID: 'Invalid project id',
  REQUEST_INVALID_CREDENTIALS: 'Invalid credentials',
  REQUEST_INVALID_AUTH_TOKEN: 'Failed to authenticate token',
  REQUEST_ACCESS_NOT_ALLOW: 'This user does not have permission to access',
  REQUEST_USER_NOT_FOUND: 'User not found'
};

exports.SQL_TABLES = {
  USERS: 'users',
  ROLES: 'roles',
  SETTINGS: 'settings'
};
