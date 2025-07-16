const Barbershop = require('../models/barberShop');

// Create a barbershop (barber only)
exports.createBarbershop = async (req, res) => {
  if (req.user.role !== 'barber') {
    return res.status(403).json({ message: 'Only barbers can create barbershops' });
  }

  const { name, description, address, services, photos, coordinates } = req.body;

  try {
    const barbershop = new Barbershop({
      owner: req.user.userId,
      name,
      description,
      address,
      services,
      photos,
      location: {
        type: 'Point',
        coordinates
      }
    });

    await barbershop.save();
    res.status(201).json(barbershop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all barbershops
exports.getBarbershops = async (req, res) => {
  try {
    const shops = await Barbershop.find().populate('owner', 'name email');
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get barbershops near a location
exports.getNearbyBarbershops = async (req, res) => {
  const { lng, lat, distance = 5000 } = req.query; // default 5km

  try {
    const shops = await Barbershop.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(distance)
        }
      }
    });

    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get barbershop by ID
exports.getBarbershopById = async (req, res) => {
  try {
    const shop = await Barbershop.findById(req.params.id).populate('owner', 'name email');
    if (!shop) return res.status(404).json({ message: 'Barbershop not found' });
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update a barbershop (owner only)
exports.updateBarbershop = async (req, res) => {
  if (req.user.role !== 'barber') {
    return res.status(403).json({ message: 'Only barbers can update barbershops' });
  }

  try {
    const shop = await Barbershop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Barbershop not found' });

    // Check if the user is the owner
    if (shop.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to update this barbershop' });
    }

    // Update the barbershop
    Object.assign(shop, req.body);
    await shop.save();
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete a barbershop (owner only)
exports.deleteBarbershop = async (req, res) => {
  if (req.user.role !== 'barber') {
    return res.status(403).json({ message: 'Only barbers can delete barbershops' });
  }

  try {
    const shop = await Barbershop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Barbershop not found' });

    // Check if the user is the owner
    if (shop.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You are not authorized to delete this barbershop' });
    }

    await shop.remove();
    res.json({ message: 'Barbershop deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}