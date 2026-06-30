const express = require('express');
const router  = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createInquiry,
  getMyInquiries,
  getAgentInquiries,
  replyToInquiry,
} = require('../controllers/inquiryController');

router.post('/',             protect, createInquiry);
router.get ('/mine',         protect, getMyInquiries);
router.get ('/agent',        protect, authorize('agent', 'admin'), getAgentInquiries);
router.put ('/:id/reply',    protect, authorize('agent', 'admin'), replyToInquiry);

module.exports = router;
