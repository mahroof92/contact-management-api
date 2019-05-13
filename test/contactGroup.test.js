/* eslint-disable no-undef */
const chai = require('chai');
const faker = require('faker/locale/en_IND');
const request = require('supertest');
const server = require('../server/server');

const { expect } = chai;

const contactGroup = {
  name: () => faker.name.findName(),
};

describe('ContactGroup', () => {
  describe('Create a Contact Group', () => {
    it('Creating a contact Group', async () => {
      request(server)
        .post('/api/contactGroup')
        .set('Content-Type', 'application/json')
        .send(contactGroup)
        .expect(200)
        .end((err, res) => {
          expect(res.body.result).to.not.equal(null);
        });
    });
  });
});
