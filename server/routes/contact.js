const express = require('express');
const contact = require('../controllers/contact.js');

const router = express.Router();

router.post('/', async (req, res) => {
  await contact.create(req, res);
});

router.get('/:id', (req, res) => {
  contact.getById(req, res);
});

router.put('/:id', async (req, res) => {
  await contact.updateById(req, res);
});

router.delete('/:id', async (req, res) => {
  await contact.deleteContactById(req, res);
});

router.get('/search/:key', async (req, res) => {
  await contact.searchContact(req, res);
});

router.get('/', (req, res) => {
  contact.getAllContacts(req, res);
});

module.exports = router;
