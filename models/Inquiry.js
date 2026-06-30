const mongoose = require('mongoose');

const InquirySchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
    sender:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agent:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message:  { type: String, required: [true, 'Message is required'], maxlength: 1000 },
    phone:    { type: String },
    status:   { type: String, enum: ['pending', 'replied', 'closed'], default: 'pending' },
    reply:    { type: String },
    repliedAt:{ type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Inquiry', InquirySchema);
