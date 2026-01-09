const Service = require('../models/Service');
const upload = require('../middleware/upload');
const fs = require("fs");
const path = require("path");

exports.addService = async (req, res) => {

try {
    const { name, price, description } = req.body;
    const image = req.file?.filename;


    if (!name || !image || !price || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const service = new Service({
      name,
      price,
      description,
      image: `/upload/${image}`, 
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
    if (!service) return res.status(404).json({ message: "Service not found" });

    if (name) service.name = name;
    if (price) service.price = price;
    if (description) service.description = description;

   if (req.file && service.image) {
  // delete old image
  const oldImagePath = path.join(
    __dirname,
    "../public",
    service.image.replace(/^\/+/, "")
  );

  if (fs.existsSync(oldImagePath)) {
    fs.unlinkSync(oldImagePath);
  }

  // set new image
  service.image = "/upload/" + req.file.filename;
}


    await service.save();

    res.status(200).json({ message: "Service updated successfully", service });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update service" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Find service first
    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // 2️⃣ Delete image if it exists
    if (service.image) {
      const imagePath = path.join(
        __dirname,
        "../public",
        service.image
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    // 3️⃣ Delete service from DB
    await Service.findByIdAndDelete(id);

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete service" });
  }
};