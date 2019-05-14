const mongoose = require('mongoose');

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

module.exports = mongoose.model('ContactGroup', ContactGroupSchema);
