const mongoose = require('mongoose');

const barbershopSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  address: String,
  services: [String],
  photos: [String], // URLs
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  }
}, {
  timestamps: true
});

barbershopSchema.index({ location: '2dsphere' }); // Enable geo queries

module.exports = mongoose.model('Barbershop', barbershopSchema);
// This model defines the structure of a barbershop document in MongoDB.
// It includes fields for the owner, name, description, address, services offered, photos, and location.