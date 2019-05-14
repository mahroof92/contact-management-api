/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const contact = require('./routes/contact');
const contactGroup = require('./routes/contactGroup');

const app = express();

let devDbUrl = 'mongodb://localhost:27017/contacts';
if (process.env.NODE_ENV === 'test') {
  devDbUrl = 'mongodb://localhost:27017/contacts-test';
}
const mongoDB = process.env.MONGODB_URI || devDbUrl;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise;
app.set('mongooseClient', mongoose);
const db = mongoose.connection;
const port = process.env.PORT || 3000;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB Connected Successfully');
  app.listen(port, () => {
    console.log(`Server is up and running on port number ${port}`);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/contacts', contact);
app.use('/api/contactGroups', contactGroup);

module.exports = app;
