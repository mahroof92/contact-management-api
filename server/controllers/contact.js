/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const Contact = require('../models/contact');
const contactService = require('../services/contact');
const errorConstant = require('../constants/errorConstant');
const appConstant = require('../constants/appConstant');

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
      tag: phone.tag || appConstant.DEFAULT_TAG.WORK,
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
      tag: email.tag || appConstant.DEFAULT_TAG.WORK,
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
    return res.status(422).send({ error: errorConstant.ERRORS.PHONE_NUMBER_MANDATORY });
  }
  const phoneNumberIdList = input.phone.filter(p => !p._id);
  if (!input._id && phoneNumberIdList.length !== input.phone.length) {
    return res.status(422).send({ error: errorConstant.ERRORS.INVALID_ID_KEY_PHONE });
  }
  let phoneNumberList = input.phone.map(p => p.number);
  if (input.phone.length !== phoneNumberList.length) {
    return res.status(422).send({ error: errorConstant.ERRORS.MISSING_PHONE_NUMBER });
  }
  // If tag is made mandatory
  const phoneNumberTagList = input.phone.map(p => p.tag);
  if (input.phone.length !== phoneNumberTagList.length) {
    return res.status(422).send({ error: errorConstant.ERRORS.MISSING_PHONE_TAG });
  }
  const inputPhoneList = await validatePhoneList(input.phone);
  // If phone number and tag has duplicate entries in the list
  if (inputPhoneList.length !== input.phone.length) {
    return res.status(422).send({ error: errorConstant.ERRORS.DUPLICATE_ENTRY_PHONE });
  }
  phoneNumberList = inputPhoneList.map(p => p.number);
  const isPhoneNumberValid = await contactService.validatePhoneNumber(phoneNumberList);
  if (!isPhoneNumberValid) {
    return res.status(422).send({ error: errorConstant.ERRORS.INVALID_PHONE_NUMBER });
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
      return res.status(422).send({ error: errorConstant.ERRORS.INVALID_ID_KEY_EMAIL });
    }
    let emailList = input.email.map(e => e.id);
    if (input.email.length !== emailList.length) {
      return res.status(422).send({ error: errorConstant.ERRORS.MISSING_EMAIL_ID });
    }
    // If tag is made mandatory
    const emailTagList = input.email.map(e => e.tag);
    if (input.email.length !== emailTagList.length) {
      return res.status(422).send({ error: errorConstant.ERRORS.MISSING_EMAIL_TAG });
    }
    const inputEmailList = await validateEmailList(input.email);
    // If Email id and tag has duplicate entries
    if (inputEmailList.length !== input.email.length) {
      return res.status(422).send({ error: errorConstant.ERRORS.DUPLICATE_ENTRY_EMAIL });
    }
    emailList = inputEmailList.map(e => e.id);
    const isEmailValid = await contactService.validateEmail(emailList);
    if (!isEmailValid) {
      return res.status(422).send({ error: errorConstant.ERRORS.INVALID_EMAIL_ID });
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
    return res.status(422).send({ error: errorConstant.ERRORS.BAD_INPUT_REQUEST });
  }
  if (input._id) {
    return res.status(422).send({ error: errorConstant.ERRORS.INVALID_ID_KEY });
  }
  if (!input.name) {
    return res.status(422).send({ error: errorConstant.ERRORS.NAME_MANDATORY });
  }
  await validatePhoneInput(req, res);
  await validateEmailInput(req, res);
  return next();
};

/**
 * Create a contact
 */
const create = async (req, res) => {
  try {
    let contact = await Contact.findOne({ name: req.body.name });
    if (contact) {
      return res.status(422).send({ error: errorConstant.ERRORS.NAME_EXISTS });
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
      return res.status(404).send({ error: errorConstant.ERRORS.INVALID_ID });
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
    return res.status(400).send({ error: errorConstant.ERRORS.MISSING_CONTACT_ID });
  }
  if (req.params.id !== req.body._id) {
    console.log('Request Param ID did not match with the request body ID');
    return res.status(400).send({ error: errorConstant.ERRORS.REQUEST_ID_MISMATCH });
  }
  if (!req.body.name) {
    return res.status(422).send({ error: errorConstant.ERRORS.NAME_MANDATORY });
  }
  [await validatePhoneInput(req, res), await validateEmailInput(req, res)];
  try {
    let contact = await Contact.findById(req.body._id);
    if (!contact) {
      console.debug('No data found with the ID: ', req.body._id);
      return res.status(404).send({ error: errorConstant.ERRORS.INVALID_ID });
    }
    const existingContactWithSameName = await Contact.findOne({
      name: req.body.name,
      _id: { $nin: contact._id },
    });
    if (existingContactWithSameName) {
      return res.status(409).send({ error: errorConstant.ERRORS.NAME_EXISTS });
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
      return res.status(404).send({ error: errorConstant.ERRORS.INVALID_ID });
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
  const searchKey = req.params.key.trim().split(' ').filter(e => e.length > 0);
  let sortKey = appConstant.SORT_KEYS.CREATEDAT;
  if (req.query && req.query.sortKey) {
    switch (req.query.sortKey) {
      case appConstant.SORT_KEYS.NAME:
        sortKey = appConstant.SORT_KEYS.NAME;
        break;
      case appConstant.SORT_KEYS.EMAIL:
        sortKey = appConstant.SORT_KEYS.EMAILID;
        break;
      case appConstant.SORT_KEYS.PHONE:
        sortKey = appConstant.SORT_KEYS.PHONENUMBER;
        break;
      case appConstant.SORT_KEYS.UPDATEDAT:
        sortKey = appConstant.SORT_KEYS.UPDATEDAT;
        break;
      default:
        sortKey = appConstant.SORT_KEYS.CREATEDAT;
        break;
    }
  }
  const sortDirection = req.query && req.query.sortDirection
    && req.query.sortDirection.toLowerCase() === appConstant.SORT_DIRECTION.ASC ? 1 : -1;
  try {
    const searchByName = searchKey.map(key => ({ name: new RegExp(key, 'i') }));
    const searchByEmail = searchKey.map(key => ({ 'email.id': new RegExp(key, 'i') }));
    const searchByPhone = searchKey.map(key => ({ 'phone.number': new RegExp(key, 'i') }));
    const contacts = await Contact.find({
      $or: [
        { $and: searchByName },
        { $and: searchByEmail },
        { $and: searchByPhone },
      ],
    }).sort({ [sortKey]: sortDirection });
    return res.send(contacts);
  } catch (error) {
    console.log('Error while searching the contact with key: ', searchKey);
    if (error.message) {
      return res.status(500).send({ error: error.message });
    }
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
