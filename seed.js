const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
require('dotenv').config();

const User     = require('./models/User');
const Property = require('./models/Property');

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected — seeding...');

  await User.deleteMany({});
  await Property.deleteMany({});

  const salt   = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash('password123', salt);

  const [admin, agent1, agent2] = await User.insertMany([
    { name: 'Admin User',  email: 'admin@realty.com',  password: hashed, role: 'admin' },
    { name: 'Sarah Jones', email: 'sarah@realty.com',  password: hashed, role: 'agent', phone: '555-1001' },
    { name: 'Mike Brown',  email: 'mike@realty.com',   password: hashed, role: 'agent', phone: '555-1002' },
  ]);

  await Property.insertMany([
    {
      title: 'Modern Downtown Apartment',
      description: 'Stunning city-view apartment in the heart of downtown. Floor-to-ceiling windows, open-plan kitchen, and access to rooftop pool.',
      type: 'apartment', status: 'for-sale', price: 485000,
      bedrooms: 2, bathrooms: 2, area: 1100, yearBuilt: 2020, furnished: true,
      address: { street: '210 Main St', city: 'New York', state: 'NY', zip: '10001' },
      location: { type: 'Point', coordinates: [-74.006, 40.7128] },
      features: ['Rooftop Pool', 'Gym', 'Doorman', 'City Views'],
      agent: agent1._id, featured: true,
    },
    {
      title: 'Spacious Family Home',
      description: 'Beautifully renovated 4-bedroom home on a quiet cul-de-sac. Large backyard, two-car garage, and top-rated school district.',
      type: 'house', status: 'for-sale', price: 720000,
      bedrooms: 4, bathrooms: 3, area: 2800, yearBuilt: 1998, parking: 2,
      address: { street: '45 Maple Ave', city: 'Austin', state: 'TX', zip: '78701' },
      location: { type: 'Point', coordinates: [-97.7431, 30.2672] },
      features: ['Backyard', 'Garage', 'Fireplace', 'Renovated Kitchen'],
      agent: agent2._id, featured: true,
    },
    {
      title: 'Cozy Studio for Rent',
      description: 'Charming studio in a historic building. Exposed brick, high ceilings, and steps from public transport.',
      type: 'apartment', status: 'for-rent', price: 1800,
      bedrooms: 0, bathrooms: 1, area: 480, yearBuilt: 1955,
      address: { street: '88 Oak St', city: 'Chicago', state: 'IL', zip: '60601' },
      location: { type: 'Point', coordinates: [-87.6298, 41.8781] },
      features: ['Exposed Brick', 'High Ceilings', 'Pet Friendly'],
      agent: agent1._id,
    },
    {
      title: 'Luxury Beachfront Condo',
      description: 'Wake up to ocean views in this stunning 3-bedroom condo. Private balcony, resort-style amenities, and direct beach access.',
      type: 'condo', status: 'for-sale', price: 1250000,
      bedrooms: 3, bathrooms: 2, area: 1800, yearBuilt: 2018, furnished: true, parking: 2,
      address: { street: '1 Ocean Dr', city: 'Miami', state: 'FL', zip: '33139' },
      location: { type: 'Point', coordinates: [-80.1300, 25.7617] },
      features: ['Ocean View', 'Beach Access', 'Pool', 'Concierge'],
      agent: agent2._id, featured: true,
    },
  ]);

  console.log('✅ Seed complete!');
  console.log('   admin@realty.com / sarah@realty.com / mike@realty.com — password: password123');
  process.exit(0);
};

seed().catch((err) => { console.error(err); process.exit(1); });
