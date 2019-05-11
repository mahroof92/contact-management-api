/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const ContactGroup = require('../models/contactGroup');
const contactGroupService = require('../services/contactGroup');

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
 * To find a contact group with id
 */
const getById = async (req, res) => {
  try {
    const contactGroup = await ContactGroup.findById(req.params.id);
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

module.exports = {
  create,
  getById,
  updateById,
  deleteById,
};
