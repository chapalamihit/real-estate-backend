const Agent = require("../models/Agent");

exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find();

    res.json({
      success: true,
      data: agents,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getAgent = async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.json({
      success: true,
      data: agent,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createAgent = async (req, res) => {
  try {
    const agent = await Agent.create(req.body);

    res.status(201).json({
      success: true,
      data: agent,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.json({
      success: true,
      data: agent,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
exports.deleteAgent = async (req, res) => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found",
      });
    }

    res.json({
      success: true,
      message: "Agent deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};