const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: [true, 'Name is required'], trim: true },
    email:    { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/^\S+@\S+\.\S+$/, 'Invalid email'] },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    phone:    { type: String },
    avatar:   { type: String, default: null },
    role:     { type: String, enum: ['buyer', 'seller', 'agent', 'admin'], default: 'buyer' },
    savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Sign JWT
UserSchema.methods.getSignedJwt = function () {
  return jwt.sign({ id: this._id, role: this.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
UserSchema.methods.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);
