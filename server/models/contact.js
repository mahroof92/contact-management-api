const mongoose = require('mongoose');

const { Schema } = mongoose;

const email = {
  id: {
    type: String,
    required: [true, "can't be blank"],
  },
  tag: {
    type: String,
    required: true,
    maxlength: 50,
    default: 'work',
  },
};

const phone = {
  number: {
    type: String,
    required: [true, "can't be blank"],
    minlength: 3,
    maxlength: 15,
  },
  tag: {
    type: String,
    required: true,
    maxlength: 50,
    default: 'work',
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

module.exports = mongoose.model('Contact', ContactSchema);
