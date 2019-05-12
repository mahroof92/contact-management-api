const express = require('express');
const contactGroup = require('../controllers/contactGroup');

const router = express.Router();

router.post('/', async (req, res) => {
  await contactGroup.create(req, res);
});

router.get('/:id', (req, res) => {
  contactGroup.getById(req, res);
});

router.put('/:id', async (req, res) => {
  await contactGroup.updateById(req, res);
});

router.delete('/:id', async (req, res) => {
  await contactGroup.deleteById(req, res);
});

router.post('/:id/contacts', async (req, res) => {
  await contactGroup.addContactsByGroupId(req, res);
});

router.get('/:id/contacts', async (req, res) => {
  await contactGroup.getContactsByGroupId(req, res);
});

router.get('/:id/contacts/toAdd', async (req, res) => {
  await contactGroup.getNonExistingContactsInGroup(req, res);
});

router.delete('/:id/contacts', async (req, res) => {
  await contactGroup.removeContactsByGroupId(req, res);
});

router.get('/', async (req, res) => {
  await contactGroup.getAllGroups(req, res);
});

module.exports = router;
