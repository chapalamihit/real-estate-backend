const User = require("../models/User");
const Property = require("../models/Property");
const Inquiry = require("../models/Inquiry");

/* Dashboard */

exports.dashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const totalAgents = await User.countDocuments({
      role: "agent",
    });

    const totalProperties = await Property.countDocuments();

    const saleProperties = await Property.countDocuments({
      status: "for-sale",
    });

    const rentProperties = await Property.countDocuments({
      status: "for-rent",
    });

    const totalInquiries = await Inquiry.countDocuments();

    res.json({
      totalUsers,
      totalAgents,
      totalProperties,
      saleProperties,
      rentProperties,
      totalInquiries,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= USERS ================= */

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "User deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= AGENTS ================= */

exports.getAgents = async (req, res) => {
  try {
    const agents = await User.find({
      role: "agent",
    });

    res.json(agents);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= PROPERTIES ================= */

exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .populate("agent", "name email")
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteProperty = async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Property deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

/* ================= INQUIRIES ================= */

exports.getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find()
      .populate("sender", "name email")
      .populate("property", "title")
      .sort({ createdAt: -1 });

    res.json(inquiries);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.deleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Inquiry deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};