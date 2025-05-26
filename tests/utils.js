const { adminCredentials } = require('./config');

async function authUser(agent) {
  const authData = await agent.post('/authorization').send(adminCredentials);
  return authData.body.access_token;
}

module.exports = {
  authUser
};
