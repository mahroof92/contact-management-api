/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const Contact = require('../models/contact');
const contactService = require('../services/contact');

/**
 * To remove the duplicates in the given array of objects
 */
const uniqueArray = a => [...new Set(a.map(o => JSON.stringify(o)))].map(s => JSON.parse(s));

/**
 * To eliminate keys other than number and tag field from the phone list
 */
const validatePhoneList = async (phoneList) => {
  const filteredPhoneList = phoneList.map((phone) => {
    const list = {
      number: phone.number,
      tag: phone.tag || 'work',
    };
    return list;
  });
  return uniqueArray(filteredPhoneList);
};

/**
 * To eliminate keys other than id and tag field from the email list
 */
const validateEmailList = async (emailList) => {
  const filteredEmailList = emailList.map((email) => {
    const list = {
      id: email.id,
      tag: email.tag || 'work',
    };
    return list;
  });
  return uniqueArray(filteredEmailList);
};

/**
 * To validate the phone input list before creating and updating a contact
 * 1. Checks whether a minimum of one phone number exists
 * 2. If new contact, _id should not be there in the input
 * 3. Checks for phone number key in all the entire list
 * 4. Check if the tag key is present in the list
 * 5. Checks if contacts has duplicate pair of phone number and tag combined
 * 6. Validate whether the given phone number is a valid phone number
 */
const validatePhoneInput = async (req, res) => {
  const input = req.body;
  if (!input.phone || !input.phone.length) {
    return res.status(422).send({ error: 'Bad Input Request - One Phone number is mandatory to create a contact' });
  }
  const phoneNumberIdList = input.phone.filter(p => !p._id);
  if (!input._id && phoneNumberIdList.length !== input.phone.length) {
    return res.status(422).send({ error: 'Bad Input Request - Invalid key _id in phone list' });
  }
  let phoneNumberList = input.phone.map(p => p.number);
  if (input.phone.length !== phoneNumberList.length) {
    return res.status(422).send({ error: 'Bad Input Request - Phone number is missing in one or more phone list' });
  }
  // If tag is made mandatory
  const phoneNumberTagList = input.phone.map(p => p.tag);
  if (input.phone.length !== phoneNumberTagList.length) {
    return res.status(422).send({ error: 'Bad Input Request - Phone number tag is missing in one or more phone list' });
  }
  const inputPhoneList = await validatePhoneList(input.phone);
  // If phone number and tag has duplicate entries in the list
  if (inputPhoneList.length !== input.phone.length) {
    return res.status(422).send({ error: 'Bad Input Request - Phone number and tag has duplicate entries' });
  }
  phoneNumberList = inputPhoneList.map(p => p.number);
  const isPhoneNumberValid = await contactService.validatePhoneNumber(phoneNumberList);
  if (!isPhoneNumberValid) {
    return res.status(422).send({ error: 'Bad Input Request - One or more phone number is invalid' });
  }
  req.body.phone = inputPhoneList;
  return null;
};

/**
 * To validate the email input list before creating and updating a contact
 * 1. Checks if email id exists in the list
 * 2. If new contact, _id should not be there in the input
 * 3. Checks for email id key in all the entire list
 * 4. Check if the tag key is present in the list
 * 5. Checks if contacts has duplicate pair of email id and tag combined
 * 6. Validate whether the given email is a valid email id
 */
const validateEmailInput = async (req, res) => {
  const input = req.body;
  if (input.email && input.email.length) {
    const emailIdList = input.email.filter(e => !e._id);
    if (!input._id && emailIdList.length !== input.email.length) {
      return res.status(422).send({ error: 'Bad Input Request - Invalid key _id in email list' });
    }
    let emailList = input.email.map(e => e.id);
    if (input.email.length !== emailList.length) {
      return res.status(422).send({ error: 'Bad Input Request - Email Id is missing in one or more email list' });
    }
    // If tag is made mandatory
    const emailTagList = input.email.map(e => e.tag);
    if (input.email.length !== emailTagList.length) {
      return res.status(422).send({ error: 'Bad Input Request - Email Id is missing in one or more email list' });
    }
    const inputEmailList = await validateEmailList(input.email);
    // If Email id and tag has duplicate entries
    if (inputEmailList.length !== input.email.length) {
      return res.status(422).send({ error: 'Bad Input Request - Email id and tag has duplicate entries' });
    }
    emailList = inputEmailList.map(e => e.id);
    const isEmailValid = await contactService.validateEmail(emailList);
    if (!isEmailValid) {
      return res.status(422).send({ error: 'Bad Input Request - One or more email id is invalid' });
    }
    req.body.email = inputEmailList;
  }
  return null;
};

/**
 * Validating the given input while creating a contact
 */
const validateInput = async (req, res, next) => {
  const input = req.body;
  if (input.length) {
    return res.status(422).send({ error: 'Bad Input Request.' });
  }
  if (input._id) {
    return res.status(422).send({ error: 'Bad Input Request - Invalid key _id' });
  }
  if (!input.name) {
    return res.status(422).send({ error: 'Bad Input Request - Name is mandatory' });
  }
  [await validatePhoneInput(req, res), await validateEmailInput(req, res)];
  return next();
};

/**
 * Create a contact
 */
const create = async (req, res) => {
  try {
    let contact = await Contact.findOne({ name: req.body.name });
    if (contact) {
      return res.status(422).send({ error: 'Bad Input Request - Name already exists' });
    }
    contact = await Contact.insertMany(req.body);
    return res.send(contact);
  } catch (error) {
    console.log('Error wile creating contact', error);
    return res.status(500).send(error);
  }
};

/**
 * To find a contact using id
 */
const getById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).send({ error: 'Invalid Id' });
    }
    return res.send(contact);
  } catch (error) {
    console.log('Error while finding the contact with ID: ', req.params.id);
    return res.status(500).send(error);
  }
};

/**
 * To update a contact using id
 */
const updateById = async (req, res) => {
  if (req.body && !req.body._id) {
    console.log('Contact ID not found in request body');
    return res.status(400).send({ error: 'Contact ID not found in request body' });
  }
  if (req.params.id !== req.body._id) {
    console.log('Request Param ID did not match with the request body ID');
    return res.status(400).send({ error: 'Request Param ID did not match with the request body ID' });
  }
  if (!req.body.name) {
    return res.status(422).send({ error: 'Bad request input - Name is mandatory' });
  }
  [await validatePhoneInput(req, res), await validateEmailInput(req, res)];
  try {
    let contact = await Contact.findById(req.body._id);
    if (!contact) {
      console.debug('No data found with the ID: ', req.body._id);
      return res.status(404).send({ error: 'Invalid ID' });
    }
    const existingContactWithSameName = await Contact.findOne({
      name: req.body.name,
      _id: { $nin: contact._id },
    });
    if (existingContactWithSameName) {
      return res.status(409).send({ error: 'Another contact with this name exists' });
    }
    contact = await Contact.findByIdAndUpdate(contact._id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    }, { new: true });
    return res.send(contact);
  } catch (error) {
    console.log('Error while updating the contact with ID: ', req.params.id);
    return res.status(500).send(error);
  }
};

/**
 * To delete a contact using id
 */
const deleteContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      console.log('No data found with the ID: ', req.params.id);
      return res.status(404).send({ error: 'Invalid ID' });
    }
    await Contact.deleteOne({ _id: req.params.id });
    return res.status(204).send();
  } catch (error) {
    console.log('Error while deleting the contact with ID: ', req.params.id);
    return res.status(500).send(error);
  }
};

/**
 * To search for a contact using Name, Email or Phone
 */
const searchContact = async (req, res) => {
  const searchKey = req.params.key;
  const sortKey = req.query && req.query.sortKey ? req.query.sortKey : 'createdAt';
  const sortDirection = req.query && req.query.sortDirection === 'asc' ? 1 : -1;
  try {
    const contacts = await Contact.find({
      $or: [
        { name: new RegExp(searchKey, 'i') },
        { 'email.id': new RegExp(searchKey, 'i') },
        { 'phone.number': new RegExp(searchKey, 'i') },
      ],
    }).sort({ [sortKey]: sortDirection });
    return res.send(contacts);
  } catch (error) {
    console.log('Error while searching the contact with key: ', searchKey);
    return res.status(500).send(error);
  }
};

/**
 * To get all contacts sorted by name
 */
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ name: 1 });
    return res.send(contacts);
  } catch (error) {
    console.log('Error while getting all contacts');
    return res.status(500).send(error);
  }
};

module.exports = {
  create,
  getById,
  updateById,
  deleteContactById,
  searchContact,
  getAllContacts,
  validateInput,
};
