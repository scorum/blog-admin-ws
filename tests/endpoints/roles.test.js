/* eslint-disable no-unused-expressions */

const chai = require('chai');
const request = require('supertest');

const { authUser } = require('../utils');

const expect = chai.expect;
const server = global.server;

let adminJwtToken = '';

describe('RolesController', () => {
  before(async () => {
    adminJwtToken = await authUser(request(server));
  });

  describe('GET /roles', () => {
    it('should return 401 when user is not authorized', async () => {
      await request(server).get('/roles').send().expect(401);
    });

    it('should return array of roles for authorized user', async () =>
      request(server)
        .get('/roles')
        .set({ 'x-auth-token': adminJwtToken })
        .send()
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.an('array');
        })
    );
  });
});
