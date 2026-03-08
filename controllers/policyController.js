const Policy = require("../models/Policy");


// Get all policies
exports.getPolicies = async (req, res) => {
 try {
    const policies = await Policy.find().sort({ title: 1 });

    res.status(200).json({
      success: true,
      policies
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

// Edit a policy

exports.updatePolicy = async (req, res) => {
    try {

    const { id } = req.params;
    const { description } = req.body;

    const policy = await Policy.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: "Policy not found"
      });
    }

    res.status(200).json({
      success: true,
      policy
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}