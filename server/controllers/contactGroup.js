/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const ContactGroup = require('../models/contactGroup');
const contactGroupService = require('../services/contactGroup');
const Contact = require('../models/contact');

/**
 * To create a contact group
 */
const create = async (req, res) => {
  try {
    const validationError = await contactGroupService.validateCreateInput(req.body);
    if (validationError) {
      return res.status(422).send({ error: validationError });
    }
    let contactGroup = await ContactGroup.findOne({ name: req.body.name });
    if (contactGroup) {
      return res.status(409).send({ error: 'Group with this name already exists' });
    }
    contactGroup = await ContactGroup.insertMany(req.body);
    return res.status(201).send(contactGroup);
  } catch (error) {
    console.log('Error wile creating a contact group', error);
    return res.status(500).send(error);
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
      return res.status(404).send({ error: 'Invalid Contact Group Id' });
    }
    return res.send(contactGroup);
  } catch (error) {
    console.log('Error while finding the contact group with ID: ', req.params.id);
    return res.status(500).send(error);
  }
};

/**
 * To update a contact group name based on its id
 */
const updateById = async (req, res) => {
  if (req.body && !req.body._id) {
    console.log('Contact Group ID not found in request body');
    return res.status(422).send({ error: 'Bad request input - _id is mandatory' });
  }
  if (req.params.id !== req.body._id) {
    console.log('Request Param ID did not match with the request body ID');
    return res.status(422).send({ error: 'Request Param ID did not match with the request body ID' });
  }
  if (req.body.contacts) {
    return res.status(422).send({ error: 'Bad request input - Invalid key contacts' });
  }
  if (!req.body.name) {
    return res.status(422).send({ error: 'Bad request input - Name is mandatory' });
  }
  try {
    let contactGroup = await ContactGroup.findById(req.body._id);
    if (!contactGroup) {
      console.debug('No data found with the ID: ', req.body._id);
      return res.status(404).send({ error: 'Invalid Contact Group Id' });
    }
    const existingContactGroup = await ContactGroup.findOne({
      name: req.body.name,
      _id: { $nin: contactGroup._id },
    });
    if (existingContactGroup) {
      return res.status(409).send({ error: 'Group with this name already exists' });
    }
    contactGroup = await ContactGroup.findByIdAndUpdate(contactGroup._id, {
      name: req.body.name,
    }, { new: true });
    return res.send(contactGroup);
  } catch (error) {
    console.log('Error while updating the contact with ID: ', req.params.id);
    return res.status(500).send(error);
  }
};

/**
 * To delete a contact group by id
 */
const deleteById = async (req, res) => {
  try {
    const contactGroup = await ContactGroup.findById(req.params.id);
    if (!contactGroup) {
      console.log('No data found with the ID: ', req.params.id);
      return res.status(404).send({ error: 'Invalid Contact Group Id' });
    }
    await ContactGroup.deleteOne({ _id: req.params.id });
    return res.status(204).send();
  } catch (error) {
    console.log('Error while deleting the contact group with ID: ', req.params.id);
    return res.status(500).send(error);
  }
};

/**
 * To add a contact or a list of contacts (max 100 at a time) to a group
 */
const addContactsByGroupId = async (req, res) => {
  try {
    if (req.body && !req.body._id) {
      console.log('Contact Group ID not found in request body');
      return res.status(422).send({ error: 'Bad request input - _id is mandatory' });
    }
    if (req.params.id !== req.body._id) {
      console.log('Request Param ID did not match with the request body ID');
      return res.status(422).send({ error: 'Request Param ID did not match with the request body ID' });
    }
    if (!req.body.contacts || !req.body.contacts.length) {
      return res.status(422).send({ error: 'Bad request input - Contacts list is mandatory' });
    }
    const newContactList = [...new Set(req.body.contacts)];
    if (newContactList.length !== req.body.contacts.length) {
      return res.status(422).send({ error: 'Bad request input - Contacts list has duplicate elements' });
    }
    if (newContactList.length > 100) {
      return res.status(422).send({ error: 'Bad request input - Contacts list length exceeds 100' });
    }
    const contacts = await Contact.find({ _id: { $in: newContactList } });
    if (contacts.length !== newContactList.length) {
      return res.status(422).send({ error: 'Bad request input - One or more contact id(s) invalid' });
    }
    let contactGroup = await ContactGroup.findById(req.params.id);
    if (!contactGroup) {
      console.debug('No data found with the ID: ', req.body._id);
      return res.status(404).send({ error: 'Invalid Contact Group Id' });
    }
    if (req.body.name && (req.body.name !== contactGroup.name)) {
      return res.status(422).send({ error: 'Bad request input - Invalid value for name' });
    }
    const existingContactList = contactGroup.contacts.map(c => c._id.toString());
    const contactList = [...new Set([...existingContactList, ...newContactList])];
    if (existingContactList.length === contactList.length) {
      return res.status(422).send({ error: 'Bad request input - Contact Id already exists in the group' });
    }
    contactGroup = await ContactGroup.findByIdAndUpdate(contactGroup._id, {
      contacts: contactList,
    }, { new: true });
    return res.send(contactGroup);
  } catch (error) {
    console.log('Error while adding contacts to contact group with ID: ', req.params.id);
    return res.status(500).send(error);
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
      console.debug('No data found with the ID: ', req.params.id);
      return res.status(404).send({ error: 'Invalid Contact Group Id' });
    }
    return res.send(contactGroup.contacts);
  } catch (error) {
    console.log('Error while adding contacts to contact group with ID: ', req.params.id);
    return res.status(500).send(error);
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
      return res.status(404).send({ error: 'Invalid Contact Group Id' });
    }
    const existingContactList = contactGroup.contacts.map(c => c._id.toString());
    const contacts = await Contact.find({
      _id: { $nin: existingContactList },
    }).sort({ name: 1 });
    return res.send(contacts);
  } catch (error) {
    console.log('Error while adding contacts to contact group with ID: ', req.params.id);
    return res.status(500).send(error);
  }
};

/**
 * To delete a contact or a list of contacts (max 100 at a time) from a group
 */
const removeContactsByGroupId = async (req, res) => {
  try {
    if (req.body && !req.body._id) {
      console.log('Contact Group ID not found in request body');
      return res.status(422).send({ error: 'Bad request input - _id is mandatory' });
    }
    if (req.params.id !== req.body._id) {
      console.log('Request Param ID did not match with the request body ID');
      return res.status(422).send({ error: 'Request Param ID did not match with the request body ID' });
    }
    if (!req.body.contacts || !req.body.contacts.length) {
      return res.status(422).send({ error: 'Bad request input - Contacts list is mandatory' });
    }
    const contactListToDelete = [...new Set(req.body.contacts)];
    if (contactListToDelete.length !== req.body.contacts.length) {
      return res.status(422).send({ error: 'Bad request input - Contacts list has duplicate elements' });
    }
    if (contactListToDelete.length > 100) {
      return res.status(422).send({ error: 'Bad request input - Contacts list length exceeds 100' });
    }
    let contactGroup = await ContactGroup.findById(req.params.id);
    if (!contactGroup) {
      console.debug('No data found with the ID: ', req.body._id);
      return res.status(404).send({ error: 'Invalid Contact Group Id' });
    }
    if (req.body.name && (req.body.name !== contactGroup.name)) {
      return res.status(422).send({ error: 'Bad request input - Invalid value for name' });
    }
    const existingContactList = contactGroup.contacts.map(c => c._id.toString());
    const contactList = existingContactList.filter(c => !contactListToDelete.includes(c));
    if (existingContactList.length === contactList.length) {
      return res.status(422).send({ error: 'Bad request input - Invalid value in contact list' });
    }
    contactGroup = await ContactGroup.findByIdAndUpdate(contactGroup._id, {
      contacts: contactList,
    }, { new: true });
    return res.send(contactGroup);
  } catch (error) {
    console.log('Error while adding contacts to contact group with ID: ', req.params.id);
    return res.status(500).send(error);
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
  updateById,
  deleteById,
  addContactsByGroupId,
  getContactsByGroupId,
  getNonExistingContactsInGroup,
  removeContactsByGroupId,
  getAllGroups,
};
