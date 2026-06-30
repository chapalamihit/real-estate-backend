const Property = require('../models/Property');

// GET /api/properties  — search + filter + pagination
exports.getProperties = async (req, res, next) => {
  try {
    const {
      type, status, minPrice, maxPrice, minBedrooms, maxBedrooms,
      city, state, featured, search, page = 1, limit = 12, sort = '-createdAt',
      lat, lng, radius,  // km
    } = req.query;

    const query = { isActive: true };

    if (type)       query.type   = type;
    if (status)     query.status = status;
    if (featured)   query.featured = featured === 'true';
    if (city)       query['address.city']  = new RegExp(city, 'i');
    if (state)      query['address.state'] = new RegExp(state, 'i');

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (minBedrooms || maxBedrooms) {
      query.bedrooms = {};
      if (minBedrooms) query.bedrooms.$gte = Number(minBedrooms);
      if (maxBedrooms) query.bedrooms.$lte = Number(maxBedrooms);
    }

    if (search) {
      query.$or = [
        { title:              new RegExp(search, 'i') },
        { description:        new RegExp(search, 'i') },
        { 'address.city':     new RegExp(search, 'i') },
        { 'address.street':   new RegExp(search, 'i') },
      ];
    }

    // Geospatial — nearby properties
    if (lat && lng && radius) {
      query.location = {
        $near: {
          $geometry:    { type: 'Point', coordinates: [Number(lng), Number(lat)] },
          $maxDistance: Number(radius) * 1000,
        },
      };
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Property.countDocuments(query);

    const properties = await Property.find(query)
      .populate('agent', 'name email phone avatar')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / limit),
      data:  properties,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/:id
exports.getProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate('agent', 'name email phone avatar');
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    // Increment view counter
    property.views++;
    await property.save();

    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// POST /api/properties
exports.createProperty = async (req, res, next) => {
  try {
    req.body.agent = req.user.id;
    if (req.files?.length) {
      req.body.images = req.files.map((f) => `/uploads/${f.filename}`);
    }
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// PUT /api/properties/:id
exports.updateProperty = async (req, res, next) => {
  try {
    let property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const isOwner = property.agent.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    if (req.files?.length) {
      req.body.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/properties/:id
exports.deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ success: false, message: 'Property not found' });

    const isOwner = property.agent.toString() === req.user.id;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ success: true, message: 'Property deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/properties/stats
exports.getStats = async (req, res, next) => {
  try {
    const [counts, avgPrice, topCities] = await Promise.all([
      Property.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Property.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$type', avgPrice: { $avg: '$price' }, count: { $sum: 1 } } },
      ]),
      Property.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$address.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ]),
    ]);

    res.json({ success: true, data: { counts, avgPrice, topCities } });
  } catch (err) {
    next(err);
  }
};
