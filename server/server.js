const express = require('express');
const bodyParser = require('body-parser');
const contact = require('./routes/contact');
const app = express();

const mongoose = require('mongoose');
let dev_db_url = 'mongodb://localhost:27017/contacts';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
const port = 3000;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('MongoDB Connected Successfully');
  app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
  });
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/contacts', contact);