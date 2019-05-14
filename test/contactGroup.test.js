/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const chai = require('chai');
const faker = require('faker');
const request = require('supertest');
const server = require('../server/server');
const { Factory } = require('./factory');

const { expect } = chai;

describe('ContactGroup API', () => {
  describe('Create a Contact Group', () => {
    it('Creating a contact Group', async () => {
      const contactGroup = {
        name: faker.name.findName(),
      };
      request(server)
        .post('/api/contactGroups')
        .set('Content-Type', 'application/json')
        .send(contactGroup)
        .expect(200)
        .end((err, res) => {
          expect(res.body.name).to.equal(contactGroup.name);
        });
    });
  });

  describe('Get a Contact Group by ID', () => {
    it('Get a contact group by id', async () => {
      const contactGroup = await Factory.create('ContactGroupWithContacts');
      request(server)
        .get(`/api/contactGroups/${contactGroup._id}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.name).to.equal(contactGroup.name);
        });
    });
  });

  describe('Update a Contact Group Name by ID', () => {
    it('Update a Contact Group Name By id', async () => {
      const contactGroup = await Factory.create('ContactGroupWithoutContacts');
      contactGroup.name = faker.lorem.word();
      request(server)
        .patch(`/api/contactGroups/${contactGroup._id}`)
        .set('Content-Type', 'application/json')
        .send(contactGroup)
        .expect(200)
        .end((err, res) => {
          expect(res.body.name).to.equal(contactGroup.name);
        });
    });
  });

  describe('Delete a Contact Group by ID', () => {
    it('Delete a contact group by id', async () => {
      const contactGroup = await Factory.create('ContactGroupWithContacts');
      request(server)
        .delete(`/api/contactGroups/${contactGroup._id}`)
        .set('Content-Type', 'application/json')
        .expect(204)
        .end((err, res) => {
          expect(res.statusCode).to.equal(204);
        });
    });
  });

  describe('Get all Contact Groups', () => {
    it('Get all contact group', async () => {
      await Factory.create('ContactGroupWithContacts');
      request(server)
        .get('/api/contactGroups/')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.not.equal(null);
        });
    });
  });

  describe('Add Contact(s) to a Group by ID', () => {
    it('Adding contact(s) to a contact group by id', async () => {
      const contactGroup = await Factory.create('ContactGroupWithoutContacts');
      const contact1 = await Factory.create('contact');
      const contact2 = await Factory.create('contact');
      contactGroup.contacts = [`${contact1._id}`, `${contact2._id}`];
      request(server)
        .post(`/api/contactGroups/${contactGroup._id}/contacts`)
        .set('Content-Type', 'application/json')
        .send(contactGroup)
        .expect(200)
        .end((err, res) => {
          expect(res.body.contacts.length).to.equal(contactGroup.contacts.length);
        });
    });
  });

  describe('Get all Contact(s) list belongs to a Group by ID', () => {
    it('Get all contact(s) present in a contact group by id', async () => {
      const contactGroup = await Factory.create('ContactGroupWithContacts');
      request(server)
        .get(`/api/contactGroups/${contactGroup._id}/contacts`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.equal(10);
        });
    });
  });

  describe('Get all Contact(s) list which does not belongs to a Group by ID', () => {
    it('Get all contact(s) which does not present in a contact group by id', async () => {
      const contactGroup = await Factory.create('ContactGroupWithContacts');
      // eslint-disable-next-line no-unused-expressions
      [await Factory.create('contact'), await Factory.create('contact')];
      request(server)
        .get(`/api/contactGroups/${contactGroup._id}/contacts/toAdd`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.greaterThan(1);
        });
    });
  });

  describe('Delete Contact(s) from a Group by ID', () => {
    it('Delete contact(s) in a contact group by id', async () => {
      const contactGroup = await Factory.create('ContactGroupWithContacts');
      contactGroup.contacts.splice(0, 2);
      request(server)
        .delete(`/api/contactGroups/${contactGroup._id}/contacts`)
        .set('Content-Type', 'application/json')
        .send(contactGroup)
        .expect(200)
        .end((err, res) => {
          expect(res.body.contacts.length).to.equal(2);
        });
    });
  });
});
