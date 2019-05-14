/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
const chai = require('chai');
const faker = require('faker');
const request = require('supertest');
const server = require('../server/server');
const { Factory } = require('./factory');

const { expect } = chai;

describe('Contact API', () => {
  describe('Create Contact', () => {
    it('Creating a contact', async () => {
      const contact = {
        name: faker.name.findName(),
        email: [{
          id: faker.internet.email(),
          tag: faker.lorem.word(),
        }],
        phone: [{
          number: faker.phone.phoneNumberFormat(),
          tag: faker.lorem.word(),
        }],
      };
      request(server)
        .post('/api/contacts')
        .set('Content-Type', 'application/json')
        .send(contact)
        .expect(201)
        .end((err, res) => {
          expect(res.body.name).to.equal(contact.name);
        });
    });
  });

  describe('Get Contact', () => {
    it('Get a contact', async () => {
      await Factory.create('contact');
      request(server)
        .get('/api/contacts')
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.length).to.not.equal(null);
        });
    });
  });

  describe('Get Contact by ID', () => {
    it('Get a contact using ID', async () => {
      const contact = await Factory.create('contact');
      request(server)
        .get(`/api/contacts/${contact._id}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body.name).to.equal(contact.name);
        });
    });
  });

  describe('Update Contact by ID', () => {
    it('Update a contact using ID', async () => {
      const contact = await Factory.create('contact');
      contact.phone[0].number = faker.phone.phoneNumberFormat();
      request(server)
        .put(`/api/contacts/${contact._id}`)
        .set('Content-Type', 'application/json')
        .send(contact)
        .expect(200)
        .end((err, res) => {
          expect(res.body.phone[0].number).to.equal(contact.phone[0].number);
        });
    });
  });

  describe('Delete Contact by ID', () => {
    it('Delete a contact using ID', async () => {
      const contact = await Factory.create('contact');
      request(server)
        .delete(`/api/contacts/${contact._id}`)
        .set('Content-Type', 'application/json')
        .expect(204)
        .end((err, res) => {
          expect(res.statusCode).to.equal(204);
        });
    });
  });

  describe('Search for Contact(s) by Name', () => {
    it('Search for contact(s) by Name', async () => {
      const contact = await Factory.create('contact');
      request(server)
        .get(`/api/contacts/searchByName/${contact.name}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body[0].name).to.equal(contact.name);
        });
    });
  });

  describe('Search for Contact(s) by Email', () => {
    it('Search for contact(s) by Email', async () => {
      const contact = await Factory.create('contact');
      request(server)
        .get(`/api/contacts/searchByEmail/${contact.email[0].id}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body[0].email[0].id).to.equal(contact.email[0].id);
        });
    });
  });

  describe('Search for Contact(s) by Phone', () => {
    it('Search for contact(s) by Phone', async () => {
      const contact = await Factory.create('contact');
      request(server)
        .get(`/api/contacts/searchByPhone/${contact.phone[0].number}`)
        .set('Content-Type', 'application/json')
        .expect(200)
        .end((err, res) => {
          expect(res.body[0].phone[0].number).to.equal(contact.phone[0].number);
        });
    });
  });
});
