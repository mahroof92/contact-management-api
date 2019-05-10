/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const Contact = require('../models/contact');

/**
 * Create a contact
 */
const create = async (req, res) => {
  try {
    const contact = await Contact.insertMany(req.body);
    return res.send(contact);
  } catch (error) {
    console.log('Error wile creating contact', error);
    return res.status(500).send(error);
  }
};

/**
 * To find a contact using id
 */
const get = (req, res) => {
  Contact.findById(req.params.id, (err, contact) => {
    if (err) {
      console.log('Error while finding the contact with ID: ', req.params.id);
      return res.status(500).send(err);
    }
    if (!contact) {
      return res.status(404).send({ error: 'Invalid Id' });
    }
    return res.send(contact);
  });
};

/**
 * To update a contact using id
 */
const update = async (req, res) => {
  if (req.body && !req.body._id) {
    console.log('Contact ID not found in request body');
    return res.status(400).send('Contact ID not found in request body');
  }
  if (req.params.id !== req.body._id) {
    console.log('Request Param ID did not match with the request body ID');
    return res.status(400).send('Request Param ID did not match with the request body ID');
  }
  try {
    let contact = await Contact.findById(req.body._id);
    if (!contact) {
      console.debug('No data found with the ID: ', req.body._id);
      return res.status(404).send({ error: 'Invalid ID' });
    }
    await Contact.deleteOne({ _id: contact._id });
    contact = await Contact.insertMany(req.body);
    return res.send(contact);
  } catch (error) {
    console.log('Error while updating the contact with ID: ', req.params.id);
    return res.status(500).send(error);
  }
};

/**
 * To delete a contact using id
 */
const deleteContact = async (req, res) => {
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

module.exports = {
  create,
  get,
  update,
  deleteContact,
  searchContact,
};
