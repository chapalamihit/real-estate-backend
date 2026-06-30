const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema(
  {
    title:       { type: String, required: [true, 'Title is required'], trim: true, maxlength: 120 },
    description: { type: String, required: [true, 'Description is required'] },
    type:        { type: String, required: true, enum: ['house', 'apartment', 'condo', 'townhouse', 'land', 'commercial'] },
    status:      { type: String, enum: ['for-sale', 'for-rent', 'sold', 'rented'], default: 'for-sale' },
    price:       { type: Number, required: [true, 'Price is required'], min: 0 },
    bedrooms:    { type: Number, min: 0, default: 0 },
    bathrooms:   { type: Number, min: 0, default: 0 },
    area:        { type: Number, required: true, min: 0 },   // sq ft
    yearBuilt:   { type: Number },
    parking:     { type: Number, default: 0 },
    furnished:   { type: Boolean, default: false },

    address: {
      street:  { type: String, required: true },
      city:    { type: String, required: true },
      state:   { type: String, required: true },
      zip:     { type: String, required: true },
      country: { type: String, default: 'US' },
    },

    location: {
      type:        { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },  // [lng, lat]
    },

    images:   [{ type: String }],
    features: [{ type: String }],       // e.g. ['Pool', 'Garden', 'Gym']

    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    views:    { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

PropertySchema.index({ location: '2dsphere' });
PropertySchema.index({ price: 1, status: 1, type: 1 });
PropertySchema.index({ 'address.city': 1 });

module.exports = mongoose.model('Property', PropertySchema);
