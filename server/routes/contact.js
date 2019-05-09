const express = require('express');
const router = express.Router();

const contact = require('../controllers/contact.js');

router.post('/', async (req, res) => {
  await contact.create(req, res);
});

router.get('/:id', (req, res) => {
  contact.get(req, res);
});

router.put('/:id', async (req, res) => {
  await contact.update(req, res);
});

router.delete('/:id', async (req, res) => {
  await contact.deleteContact(req, res);
});

module.exports = router;