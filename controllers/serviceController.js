const Service = require('../models/Service');
const upload = require('../middleware/upload');
const fs = require("fs");
const path = require("path");

exports.addService = async (req, res) => {

try {
    const { name, price, description } = req.body;
    const image = req.file?.path;
    const imagePublicId = req.file?.filename;


    if (!name || !image || !price || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const service = new Service({
      name,
      price,
      description,
      image,
      imagePublicId,
    });

    await service.save();

    res.status(201).json({ message: 'Service added successfully', service });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getServices = async (req, res) => {
    try {
    const services = await Service.find(); 
    res.json(services);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Update text fields
    if (name) service.name = name;
    if (price) service.price = price;
    if (description) service.description = description;

    // If new image is uploaded
    if (req.file) {
      // 1️⃣ Delete old image from Cloudinary
      if (service.imagePublicId) {
        await cloudinary.uploader.destroy(service.imagePublicId);
      }

      // 2️⃣ Save new image
      service.image = req.file.path;
      service.imagePublicId = req.file.filename;
    }

    await service.save();

    res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update service",
    });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find service
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // 2️⃣ Delete image from Cloudinary
    if (service.imagePublicId) {
      await cloudinary.uploader.destroy(service.imagePublicId);
    }

    // 3️⃣ Delete from DB
    await Service.findByIdAndDelete(id);

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to delete service",
    });
  }
};