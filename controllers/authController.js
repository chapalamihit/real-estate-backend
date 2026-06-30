const User = require('../models/User');

// Helper — send token response
const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwt();
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id:    user._id,
      name:  user.name,
      email: user.email,
      role:  user.role,
    },
  });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const user = await User.create({ name, email, password, phone, role });
    sendToken(user, 201, res);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id).populate('savedProperties', 'title price address images');
  res.json({ success: true, data: user });
};

// PUT /api/auth/me
exports.updateMe = async (req, res, next) => {
  try {
    const fields = { name: req.body.name, phone: req.body.phone };
    if (req.file) fields.avatar = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, fields, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/auth/password
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = req.body.newPassword;
    await user.save();
    sendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/save/:propertyId
exports.saveProperty = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const pid  = req.params.propertyId;
    const idx  = user.savedProperties.indexOf(pid);
    if (idx === -1) {
      user.savedProperties.push(pid);
    } else {
      user.savedProperties.splice(idx, 1);
    }
    await user.save();
    res.json({ success: true, savedProperties: user.savedProperties });
  } catch (err) {
    next(err);
  }
};
// POST /api/auth/admin/login
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin only.",
      });
    }

    sendToken(user, 200, res);

  } catch (err) {
    next(err);
  }
};