const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const email = {
  id: {
    type: String,
    required: [true, "can't be blank"],
    unique: true,
    // eslint-disable-next-line no-useless-escape
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please enter a valid email'],
  },
  tag: {
    type: String,
    required: true,
    maxlength: 50,
    default: 'work',
    enum: ['work', 'other', 'custom'],
  },
};

const phone = {
  number: {
    type: String,
    required: [true, "can't be blank"],
    unique: true,
    match: [/^[0-9]+$/, 'Only Numbers allowed'],
    minlength: 10,
    maxlength: 10,
  },
  tag: {
    type: String,
    required: true,
    maxlength: 50,
    default: 'mobile',
    enum: ['mobile', 'work', 'home', 'other'],
  },
};

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
  },
  email: [email],
  phone: [phone],
}, {
  timestamps: true,
});

ContactSchema.plugin(uniqueValidator, { message: 'is already exists.' });

module.exports = mongoose.model('Contact', ContactSchema);
