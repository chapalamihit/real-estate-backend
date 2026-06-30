const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const upload      = require('../middleware/upload');
const {
  register,
  login,
  adminLogin,
  getMe,
  updateMe,
  updatePassword,
  saveProperty,
} = require("../controllers/authController");

router.post('/register',          register);
router.post('/login',             login);
router.get ('/me',                protect, getMe);
router.put ('/me',                protect, upload.single('avatar'), updateMe);
router.put ('/password',          protect, updatePassword);
router.post('/save/:propertyId',  protect, saveProperty);
router.post("/admin/login", adminLogin);

module.exports = router;
