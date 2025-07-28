const Service = require('../models/Service');
const upload = require('../middleware/upload');

exports.addService = async (req, res) => {

try {
    const { name, price } = req.body;
    const image = req.file?.filename;


    if (!name || !image || !price) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const service = new Service({
      name,
      price,
      image: `/uploads/${image}`, 
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