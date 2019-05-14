const express = require('express');
const contact = require('../controllers/contact.js');

const router = express.Router();

/**
 * Create a contact
 *
 * Sample Input
 * {
 *    "name": "sample name",
 *    "email": [{
 *      "id": "abc@xyz.com",
 *      "tag": "work"
 *    }]
 *    "phone": [{
 *      "id": "abc@xyz.com",
 *      "tag": "work"
 *    }]
 * }
 */
router.post('/', async (req, res) => {
  await contact.create(req, res);
});

router.get('/:id', async (req, res) => {
  contact.getById(req, res);
});

/**
 * Update a contact
 *
 * Sample Input
 * {
 *    "_id": "5cd8323b2c5ff629f11d5b6d",
 *    "name": "sample name",
 *    "email": [{
 *      "id": "abc@xyz.com",
 *      "tag": "work"
 *    }]
 *    "phone": [{
 *      "id": "abc@xyz.com",
 *      "tag": "work"
 *    }]
 * }
 */
router.put('/:id', async (req, res) => {
  await contact.updateById(req, res);
});

router.delete('/:id', async (req, res) => {
  await contact.deleteContactById(req, res);
});

/**
 * To search for a contact using name, email or phone with sort
 *
 * /search/test?sortKey=email&sortDirection=desc
 *
 */
router.get('/search/:key', async (req, res) => {
  await contact.searchContact(req, res);
});

router.get('/', (req, res) => {
  contact.getAllContacts(req, res);
});

module.exports = router;
