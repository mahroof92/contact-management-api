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

module.exports = router;
