/* eslint-disable no-unused-vars */
const FactoryGirl = require('factory-girl');
const faker = require('faker/locale/en_IND');
const app = require('../server/server');

const { factory } = FactoryGirl;
const adapter = new FactoryGirl.MongooseAdapter();

// use the mongoose adapter as the default adapter
factory.setAdapter(adapter);
const client = app.get('mongooseClient');

const Contact = client.model('Contact');

factory.define('contact', Contact, buildOptions => ({
  name: faker.name.firstName,
  email: [{ id: faker.internet.email, tag: faker.lorem.word }],
  phone: [{ number: faker.phone.phoneNumber, tag: faker.lorem.word }],
}));

const ContactGroup = client.model('ContactGroup');

factory.define('ContactGroupWithoutContacts', ContactGroup, buildOptions => ({
  name: faker.lorem.word,
}));

factory.define('ContactGroupWithContacts', ContactGroup, buildOptions => ({
  name: faker.lorem.word,
  contacts: factory.assocMany('contact', 10, '_id'),
}));

module.exports = {
  Factory: factory,
};
