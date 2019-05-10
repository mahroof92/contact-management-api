const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const { Schema } = mongoose;

const ContactGroupSchema = new Schema({
  name: {
    type: String,
    required: [true, "can't be blank"],
    unique: true,
    maxlength: 100,
  },
  contacts: [{
    type: Schema.ObjectId,
    ref: 'Contact',
  }],
}, {
  timestamps: true,
});

ContactGroupSchema.plugin(uniqueValidator, { message: 'is already exists.' });

module.exports = mongoose.model('ContactGroup', ContactGroupSchema);
