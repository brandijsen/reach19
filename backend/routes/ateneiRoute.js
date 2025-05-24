const express = require('express');
const router = express.Router();
const controller = require('../controllers/ateneiController');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.post('/multiple', controller.createMultiple); // <--- Nuova rotta

router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
