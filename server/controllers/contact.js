/* eslint-disable no-useless-escape */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const Contact = require('../models/contact');
const contactService = require('../services/contact');
const errorConstant = require('../constants/errorConstant');
const appConstant = require('../constants/appConstant');
const AppError = require('../errors/appError');

/**
 * Saving a new contact to the databse
 */
const createNewContact = async (input) => {
  try {
    let contact = await Contact.findOne({ name: input.name });
    if (contact) {
      throw new AppError(errorConstant.ERRORS.NAME_EXISTS);
    }
    contact = await Contact.create(input);
    return contact;
  } catch (error) {
    throw error;
  }
};

/**
 * To create a new contact
 */
const create = async (req, res) => {
  try {
    const input = await contactService.validateContactInput(req.body);
    const contact = await createNewContact(input);
    return res.status(201).send(contact);
  } catch (error) {
    console.log('Error while creating a contact: ', error);
    return res.status(error.status).send(error);
  }
};

/**
 * To find a contact using id
 */
const getById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      throw new AppError(errorConstant.ERRORS.INVALID_ID);
    }
    return res.send(contact);
  } catch (error) {
    console.log(`Error while finding the contact with ID: ${req.params.id} - ${error}`);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To check if a contact exists
 * To check if any other contact has the same name entered by the user
 */
const checkIfContactExists = async (input) => {
  try {
    const contact = await Contact.findById(input._id);
    if (!contact) {
      throw new AppError(errorConstant.ERRORS.INVALID_ID);
    }
    const existingContactWithSameName = await Contact.findOne({
      name: input.name,
      _id: { $nin: contact._id },
    });
    if (existingContactWithSameName) {
      throw new AppError(errorConstant.ERRORS.NAME_EXISTS);
    }
    return null;
  } catch (error) {
    throw error;
  }
};

/**
 * Find a contact by Id and update a contact
 */
const findByIdAndUpdateInput = async (input) => {
  try {
    const contact = await Contact.findByIdAndUpdate(input._id, {
      name: input.name,
      email: input.email,
      phone: input.phone,
    }, { new: true });
    return contact;
  } catch (error) {
    throw error;
  }
};

/**
 * To update a contact using id
 */
const updateById = async (req, res) => {
  try {
    const input = await contactService.validateUpdateInput(req.params.id, req.body);
    await checkIfContactExists(input);
    const contact = await findByIdAndUpdateInput(input);
    return res.send(contact);
  } catch (error) {
    console.log(`Error while updating the contact with ID: ${req.params.id} - ${error}`);
    return res.status(error.status).send(error);
  }
};

/**
 * To delete a contact using id
 */
const deleteContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      throw new AppError(errorConstant.ERRORS.INVALID_ID);
    }
    await Contact.deleteOne({ _id: req.params.id });
    return res.status(204).send();
  } catch (error) {
    console.log(`Error while deleting the contact with ID: ${req.params.id} - ${error}`);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To search for a contact using Name
 */
const searchContactByName = async (req, res) => {
  try {
    let searchKey = req.params.key.trim().split(' ').filter(e => e.length > 0);
    searchKey = searchKey.map(key => key.replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1'));
    const sortKey = await contactService.getSortKey(req.query);
    const sortDirection = req.query && req.query.sortDirection
      && req.query.sortDirection.toLowerCase() === appConstant.SORT_DIRECTION.ASC ? 1 : -1;
    const searchByName = await searchKey.map(key => ({ name: new RegExp(key, 'i') }));
    const contacts = await Contact.find({
      $and: searchByName,
    }).sort({ [sortKey]: sortDirection });
    return res.send(contacts);
  } catch (error) {
    console.log(`Error while searching the contact by name: ${req.params.key} - ${error}`);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To search for a contact using Email
 */
const searchContactByEmail = async (req, res) => {
  try {
    let searchKey = req.params.key.trim().split(' ').filter(e => e.length > 0);
    if (searchKey.length > 1) {
      throw new AppError(errorConstant.ERRORS.NO_SPACE_ALLOWED);
    }
    searchKey = req.params.key.trim().replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
    const sortKey = await contactService.getSortKey(req.query);
    const sortDirection = req.query && req.query.sortDirection
      && req.query.sortDirection.toLowerCase() === appConstant.SORT_DIRECTION.ASC ? 1 : -1;
    const contacts = await Contact.find({
      'email.id': new RegExp(searchKey, 'i'),
    }).sort({ [sortKey]: sortDirection });
    return res.send(contacts);
  } catch (error) {
    console.log(`Error while searching the contact by email: ${req.params.key} - ${error}`);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To search for a contact using Phone
 */
const searchContactByPhone = async (req, res) => {
  try {
    let searchKey = req.params.key.trim().split(' ').filter(e => e.length > 0);
    if (searchKey.length > 1) {
      throw new AppError(errorConstant.ERRORS.NO_SPACE_ALLOWED);
    }
    searchKey = req.params.key.trim().replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
    const sortKey = await contactService.getSortKey(req.query);
    const sortDirection = req.query && req.query.sortDirection
      && req.query.sortDirection.toLowerCase() === appConstant.SORT_DIRECTION.ASC ? 1 : -1;
    const contacts = await Contact.find({
      'phone.number': new RegExp(searchKey, 'i'),
    }).sort({ [sortKey]: sortDirection });
    return res.send(contacts);
  } catch (error) {
    console.log(`Error while searching the contact by phone: ${req.params.key} - ${error}`);
    return res.status(error.status || 500).send(error);
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
  searchContactByName,
  getAllContacts,
  searchContactByEmail,
  searchContactByPhone,
};
