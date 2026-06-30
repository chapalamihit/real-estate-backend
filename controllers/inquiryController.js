const Inquiry  = require('../models/Inquiry');
const Property = require('../models/Property');

// POST /api/inquiries
exports.createInquiry = async (req, res, next) => {
  try {
    const property = await Property.findById(req.body.property);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const inquiry = await Inquiry.create({
      ...req.body,
      sender: req.user.id,
      agent:  property.agent,
    });

    await inquiry.populate([
      { path: 'property', select: 'title address' },
      { path: 'sender',   select: 'name email phone' },
    ]);

    res.status(201).json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};

// GET /api/inquiries/mine  — buyer sees their own inquiries
exports.getMyInquiries = async (req, res, next) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.user.id })
      .populate('property', 'title address images price')
      .populate('agent', 'name email phone')
      .sort('-createdAt');
    res.json({ success: true, data: inquiries });
  } catch (err) {
    next(err);
  }
};

// GET /api/inquiries/agent  — agent sees inquiries addressed to them
exports.getAgentInquiries = async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = { agent: req.user.id };
    if (status) query.status = status;

    const inquiries = await Inquiry.find(query)
      .populate('property', 'title address images price')
      .populate('sender', 'name email phone')
      .sort('-createdAt');

    res.json({ success: true, data: inquiries });
  } catch (err) {
    next(err);
  }
};

// PUT /api/inquiries/:id/reply
exports.replyToInquiry = async (req, res, next) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    if (inquiry.agent.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    inquiry.reply     = req.body.reply;
    inquiry.status    = 'replied';
    inquiry.repliedAt = new Date();
    await inquiry.save();

    res.json({ success: true, data: inquiry });
  } catch (err) {
    next(err);
  }
};
