/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const ContactGroup = require('../models/contactGroup');
const contactGroupService = require('../services/contactGroup');
const Contact = require('../models/contact');
const errorConstant = require('../constants/errorConstant');
const AppError = require('../errors/appError');

/**
 * To create a contact group
 */
const create = async (req, res) => {
  try {
    const validationError = await contactGroupService.validateCreateInput(req.body);
    if (validationError) {
      throw new AppError(validationError);
    }
    let contactGroup = await ContactGroup.findOne({ name: req.body.name });
    if (contactGroup) {
      throw new AppError(errorConstant.ERRORS.GROUP_EXISTS);
    }
    contactGroup = await ContactGroup.create(req.body);
    return res.status(201).send(contactGroup);
  } catch (error) {
    console.log('Error wile creating a contact group', error);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To find a contact group with all its contacts sorted by name
 */
const getById = async (req, res) => {
  try {
    const contactGroup = await ContactGroup.findById(req.params.id).populate({
      path: 'contacts',
      options: { sort: { name: 1 } },
    });
    if (!contactGroup) {
      throw new AppError(errorConstant.ERRORS.INVALID_GROUP_ID);
    }
    return res.send(contactGroup);
  } catch (error) {
    console.log('Error while finding the contact group with ID: ', req.params.id);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To update a contact group name based on its id
 */
const updateNameById = async (req, res) => {
  try {
    if (req.body && !req.body._id) {
      throw new AppError(errorConstant.ERRORS.ID_MANDATORY);
    }
    if (req.params.id !== req.body._id) {
      throw new AppError(errorConstant.ERRORS.REQUEST_ID_MISMATCH);
    }
    if (req.body.contacts && req.body.contacts.length) {
      throw new AppError(errorConstant.ERRORS.INVALID_KEY_CONTACTS);
    }
    if (!req.body.name) {
      throw new AppError(errorConstant.ERRORS.NAME_MANDATORY);
    }
    let contactGroup = await ContactGroup.findById(req.body._id);
    if (!contactGroup) {
      throw new AppError(errorConstant.ERRORS.INVALID_GROUP_ID);
    }
    const existingContactGroup = await ContactGroup.findOne({
      name: req.body.name,
      _id: { $nin: contactGroup._id },
    });
    if (existingContactGroup) {
      throw new AppError(errorConstant.ERRORS.GROUP_EXISTS);
    }
    contactGroup = await ContactGroup.findByIdAndUpdate(contactGroup._id, {
      name: req.body.name,
    }, { new: true });
    return res.send(contactGroup);
  } catch (error) {
    console.log('Error while updating the contact with ID: ', req.params.id);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To delete a contact group by id
 */
const deleteById = async (req, res) => {
  try {
    const contactGroup = await ContactGroup.findById(req.params.id);
    if (!contactGroup) {
      throw new AppError(errorConstant.ERRORS.INVALID_GROUP_ID);
    }
    await ContactGroup.deleteOne({ _id: req.params.id });
    return res.status(204).send();
  } catch (error) {
    console.log('Error while deleting the contact group with ID: ', req.params.id);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To add a contact or a list of contacts (max 100 at a time) to a group
 */
const addContactsByGroupId = async (req, res) => {
  try {
    if (req.body && !req.body._id) {
      throw new AppError(errorConstant.ERRORS.ID_MANDATORY);
    }
    if (req.params.id !== req.body._id) {
      throw new AppError(errorConstant.ERRORS.REQUEST_ID_MISMATCH);
    }
    if (!req.body.contacts || !req.body.contacts.length) {
      throw new AppError(errorConstant.ERRORS.CONTACT_LIST_MANDATORY);
    }
    const newContactList = [...new Set(req.body.contacts)];
    if (newContactList.length !== req.body.contacts.length) {
      throw new AppError(errorConstant.ERRORS.DUPLICATE_CONTACT_LIST);
    }
    if (newContactList.length > process.env.MAX_LENGTH) {
      throw new AppError(errorConstant.ERRORS.MAX_CONTACT_EXCEEDS);
    }
    const contacts = await Contact.find({ _id: { $in: newContactList } });
    if (contacts.length !== newContactList.length) {
      throw new AppError(errorConstant.ERRORS.INVALID_CONTACT_IDS);
    }
    let contactGroup = await ContactGroup.findById(req.params.id);
    if (!contactGroup) {
      throw new AppError(errorConstant.ERRORS.INVALID_GROUP_ID);
    }
    if (req.body.name && (req.body.name !== contactGroup.name)) {
      throw new AppError(errorConstant.ERRORS.INVALID_VALUE_NAME);
    }
    const existingContactList = contactGroup.contacts.map(c => c._id.toString());
    const contactList = [...new Set([...existingContactList, ...newContactList])];
    if (existingContactList.length === contactList.length) {
      throw new AppError(errorConstant.ERRORS.CONTACT_ID_EXISTS);
    }
    contactGroup = await ContactGroup.findByIdAndUpdate(contactGroup._id, {
      contacts: contactList,
    }, { new: true });
    return res.send(contactGroup);
  } catch (error) {
    console.log('Error while adding contacts to contact group with ID: ', req.params.id);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To get the list of all contacts in the group, sorted by name
 */
const getContactsByGroupId = async (req, res) => {
  try {
    const contactGroup = await ContactGroup.findById(req.params.id).populate({
      path: 'contacts',
      options: { sort: { name: 1 } },
    });
    if (!contactGroup) {
      throw new AppError(errorConstant.ERRORS.INVALID_GROUP_ID);
    }
    return res.send(contactGroup.contacts);
  } catch (error) {
    console.log('Error while adding contacts to contact group with ID: ', req.params.id);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To get the list of all contacts to be added to the group, sorted by name
 */
const getNonExistingContactsInGroup = async (req, res) => {
  try {
    const contactGroup = await ContactGroup.findById(req.params.id);
    if (!contactGroup) {
      console.debug('No data found with the ID: ', req.params.id);
      throw new AppError(errorConstant.ERRORS.INVALID_GROUP_ID);
    }
    const existingContactList = contactGroup.contacts.map(c => c._id.toString());
    const contacts = await Contact.find({
      _id: { $nin: existingContactList },
    }).sort({ name: 1 });
    return res.send(contacts);
  } catch (error) {
    console.log('Error while adding contacts to contact group with ID: ', req.params.id);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To delete a contact or a list of contacts (max 100 at a time) from a group
 */
const removeContactsByGroupId = async (req, res) => {
  try {
    if (req.body && !req.body._id) {
      throw new AppError(errorConstant.ERRORS.ID_MANDATORY);
    }
    if (req.params.id !== req.body._id) {
      throw new AppError(errorConstant.ERRORS.REQUEST_ID_MISMATCH);
    }
    if (!req.body.contacts || !req.body.contacts.length) {
      throw new AppError(errorConstant.ERRORS.CONTACT_LIST_MANDATORY);
    }
    const contactListToDelete = [...new Set(req.body.contacts)];
    if (contactListToDelete.length !== req.body.contacts.length) {
      throw new AppError(errorConstant.ERRORS.DUPLICATE_CONTACT_LIST);
    }
    if (contactListToDelete.length > process.env.MAX_LENGTH) {
      throw new AppError(errorConstant.ERRORS.MAX_CONTACT_EXCEEDS);
    }
    let contactGroup = await ContactGroup.findById(req.params.id);
    if (!contactGroup) {
      throw new AppError(errorConstant.ERRORS.INVALID_GROUP_ID);
    }
    if (req.body.name && (req.body.name !== contactGroup.name)) {
      throw new AppError(errorConstant.ERRORS.INVALID_VALUE_NAME);
    }
    const existingContactList = contactGroup.contacts.map(c => c._id.toString());
    const contactList = existingContactList.filter(c => !contactListToDelete.includes(c));
    if (existingContactList.length === contactList.length) {
      throw new AppError(errorConstant.ERRORS.INVALID_CONTACT_IDS);
    }
    contactGroup = await ContactGroup.findByIdAndUpdate(contactGroup._id, {
      contacts: contactList,
    }, { new: true });
    return res.send(contactGroup);
  } catch (error) {
    console.log('Error while adding contacts to contact group with ID: ', req.params.id);
    return res.status(error.status || 500).send(error);
  }
};

/**
 * To get all contact groups sorted by name
 */
const getAllGroups = async (req, res) => {
  try {
    const contactGroups = await ContactGroup.find().sort({ name: 1 });
    return res.send(contactGroups);
  } catch (error) {
    console.log('Error while getting all contact groups');
    return res.status(500).send(error);
  }
};

module.exports = {
  create,
  getById,
  updateNameById,
  deleteById,
  addContactsByGroupId,
  getContactsByGroupId,
  getNonExistingContactsInGroup,
  removeContactsByGroupId,
  getAllGroups,
};
