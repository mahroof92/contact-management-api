/* eslint-disable no-undef */
const chai = require('chai');
const faker = require('faker/locale/en_IND');
const request = require('supertest');
const server = require('../server/server');

const { expect } = chai;

const contact = {
  name: () => faker.name.findName(),
  email: [{
    id: () => faker.internet.email(),
    tag: () => faker.lorem.words(),
  }],
  phone: [{
    number: () => faker.phone.phoneNumber(),
    tag: () => faker.lorem.words(),
  }],
};

describe('Contact', () => {
  describe('Create Contact', () => {
    it('Creating a contact - Valid Input', async () => {
      request(server)
        .post('/api/contacts')
        .set('Content-Type', 'application/json')
        .send(contact)
        .expect(200)
        .end((err, res) => {
          expect(res.body.result).to.not.equal(null);
        });
    });
  });
});
