/* eslint-disable no-unused-expressions */

const chai = require('chai');
const request = require('supertest');

const { adminCredentials } = require('../config');

const expect = chai.expect;
const server = global.server;

describe('AuthorizationController', () => {
  describe('POST /authorization', () => {
    it('should get valid JWT token', () =>
      request(server)
        .post('/authorization')
        .send(adminCredentials)
        .expect(200)
        .then((res) => {
          expect(res.body).to.have.property('access_token');
          expect(res.body).to.have.property('role');
          expect(res.body).to.have.property('id');
        })
    );

    it('should return 401 when username is incorrect', () =>
      request(server)
        .post('/authorization')
        .send({ email: 'incorrect@mail.com', pass: adminCredentials.pass })
        .expect(401)
        .then((res) => {
          expect(res.body).to.have.property('code').to.equal('102');
          expect(res.body).to.have.property('message');
        })
    );

    it('should return 401 when password is incorrect', () =>
      request(server)
        .post('/authorization')
        .send({ email: adminCredentials.email, pass: '11111111' })
        .expect(401)
        .then((res) => {
          expect(res.body).to.have.property('code').to.equal('102');
          expect(res.body).to.have.property('message');
        })
    );
  });
});
