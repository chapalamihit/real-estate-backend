const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload                 = require('../middleware/upload');
const {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getStats,
} = require('../controllers/propertyController');

router.get ('/',       getProperties);
router.get ('/stats',  getStats);
router.get ('/:id',    getProperty);

router.post('/',
  protect,
  authorize('agent', 'admin'),
  upload.array('images', 10),
  createProperty
);

router.put('/:id',
  protect,
  authorize('agent', 'admin'),
  upload.array('images', 10),
  updateProperty
);

router.delete('/:id',
  protect,
  authorize('agent', 'admin'),
  deleteProperty
);

module.exports = router;
