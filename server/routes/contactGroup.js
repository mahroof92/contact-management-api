const express = require('express');
const contactGroup = require('../controllers/contactGroup');

const router = express.Router();

/**
 * Create a contact group
 *
 * Sample Input
 * {
 *    "name": "sample name"
 * }
 */
router.post('/', async (req, res) => {
  await contactGroup.create(req, res);
});

router.get('/:id', (req, res) => {
  contactGroup.getById(req, res);
});

/**
 * Update a contact group name by id
 *
 * Sample Input
 * {
 *    "_id": "5cd8323b2c5ff629f11d5b6d",
 *    "name": "sample name"
 * }
 */
router.put('/:id', async (req, res) => {
  await contactGroup.updateNameById(req, res);
});

router.delete('/:id', async (req, res) => {
  await contactGroup.deleteById(req, res);
});

/**
 * To add contact(s) to a contact group
 *
 * Sample Input
 * {
 *    "_id": "5cd8323b2c5ff629f11d5b6d",
 *    "contacts": ["5cd8323b2c5ff629f11d5b6d", "5cb1723b2c5ee543f11d5b7c"]
 * }
 */
router.post('/:id/contacts', async (req, res) => {
  await contactGroup.addContactsByGroupId(req, res);
});

router.get('/:id/contacts', async (req, res) => {
  await contactGroup.getContactsByGroupId(req, res);
});

router.get('/:id/contacts/toAdd', async (req, res) => {
  await contactGroup.getNonExistingContactsInGroup(req, res);
});

/**
 * To delete contact(s) from a contact group
 *
 * Sample Input
 * {
 *    "_id": "5cd8323b2c5ff629f11d5b6d",
 *    "contacts": ["5cd8323b2c5ff629f11d5b6d", "5cb1723b2c5ee543f11d5b7c"]
 * }
 */
router.delete('/:id/contacts', async (req, res) => {
  await contactGroup.removeContactsByGroupId(req, res);
});

router.get('/', async (req, res) => {
  await contactGroup.getAllGroups(req, res);
});

module.exports = router;
