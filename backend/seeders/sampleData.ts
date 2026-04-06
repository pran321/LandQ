import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User, { UserRole, UserType } from '../models/user';
import Land from '../models/land';
import connectDB from '../config/database';

dotenv.config();

const sampleUsers = [
  {
    name: 'Purav',
    email: 'purav@admin.com',
    password: '123456',
    role: UserRole.ADMIN,
    userType: UserType.SELLER,
    phone: '1234567890',
  },
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: UserRole.ADMIN,
    userType: UserType.SELLER,
    phone: '1234567890',
  },
  {
    name: 'John Seller',
    email: 'seller@example.com',
    password: 'seller123',
    role: UserRole.USER,
    userType: UserType.SELLER,
    phone: '9876543210',
  },
  {
    name: 'Jane Buyer',
    email: 'buyer@example.com',
    password: 'buyer123',
    role: UserRole.USER,
    userType: UserType.BUYER,
    phone: '5555555555',
  },
  {
    name: 'Michael Property',
    email: 'michael@example.com',
    password: 'seller123',
    role: UserRole.USER,
    userType: UserType.SELLER,
    phone: '4445556666',
  },
  {
    name: 'Sarah Estates',
    email: 'sarah@example.com',
    password: 'seller123',
    role: UserRole.USER,
    userType: UserType.SELLER,
    phone: '7778889999',
  },
];

const sampleLands = [
  {
    title: 'Beautiful Farm Land with River View',
    description: 'Perfect agricultural land with fertile soil, water access, and stunning river views. Ideal for organic farming or vineyard. Includes irrigation system and storage shed.',
    price: 85000,
    size: 8000,
    length: 160,
    breadth: 50,
    location: 'Rural Highway 45, Near River Valley',
    city: 'Springfield',
    state: 'Illinois',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800',
      'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'
    ]
  },
  {
    title: 'Prime Commercial Plot - City Center',
    description: 'Excellent commercial location in the heart of downtown. High foot traffic area, perfect for retail, restaurant, or office building. All utilities available.',
    price: 250000,
    size: 4500,
    length: 90,
    breadth: 50,
    location: 'Main Street, Downtown',
    city: 'Chicago',
    state: 'Illinois',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800'
    ]
  },
  {
    title: 'Luxury Residential Plot - Gated Community',
    description: 'Premium residential land in exclusive gated community. Surrounded by luxury homes, parks, and amenities. Perfect for building your dream home.',
    price: 120000,
    size: 3500,
    length: 70,
    breadth: 50,
    location: 'Green Valley Estates',
    city: 'Aurora',
    state: 'Illinois',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800'
    ]
  },
  {
    title: 'Mountain View Ranch Land',
    description: 'Spectacular 15-acre ranch land with panoramic mountain views. Perfect for horse ranch, retreat center, or luxury estate. Natural springs on property.',
    price: 180000,
    size: 15000,
    length: 300,
    breadth: 50,
    location: 'Mountain Ridge Road',
    city: 'Boulder',
    state: 'Colorado',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ]
  },
  {
    title: 'Beachfront Property - Ocean View',
    description: 'Rare beachfront land with direct ocean access. Stunning sunset views, private beach area. Zoned for residential or small resort development.',
    price: 450000,
    size: 6000,
    length: 120,
    breadth: 50,
    location: 'Coastal Highway 1',
    city: 'Malibu',
    state: 'California',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
      'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
    ]
  },
  {
    title: 'Industrial Warehouse Plot',
    description: 'Large industrial plot near major highway and rail access. Perfect for warehouse, distribution center, or manufacturing facility. Utilities ready.',
    price: 320000,
    size: 12000,
    length: 200,
    breadth: 60,
    location: 'Industrial Park Drive',
    city: 'Houston',
    state: 'Texas',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
      'https://images.unsplash.com/photo-1565008576549-57569a49371d?w=800'
    ]
  },
  {
    title: 'Vineyard Estate Land',
    description: 'Premium vineyard land with established grape vines. South-facing slope, excellent drainage, and microclimate. Includes wine cellar and tasting room.',
    price: 280000,
    size: 10000,
    length: 200,
    breadth: 50,
    location: 'Wine Country Road',
    city: 'Napa',
    state: 'California',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800',
      'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
      'https://images.unsplash.com/photo-1474557157379-8aa74a6ef541?w=800'
    ]
  },
  {
    title: 'Lakefront Cabin Land',
    description: 'Peaceful lakefront property with mature trees and private dock. Perfect for vacation cabin or year-round residence. Fishing and boating paradise.',
    price: 95000,
    size: 5500,
    length: 110,
    breadth: 50,
    location: 'Lakeshore Drive',
    city: 'Lake Tahoe',
    state: 'Nevada',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800'
    ]
  },
  {
    title: 'Golf Course Community Lot',
    description: 'Premium lot in prestigious golf course community. Overlooking 18th hole with clubhouse views. Access to all amenities including pool, tennis, and spa.',
    price: 165000,
    size: 4200,
    length: 84,
    breadth: 50,
    location: 'Fairway Boulevard',
    city: 'Scottsdale',
    state: 'Arizona',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800',
      'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800'
    ]
  },
  {
    title: 'Forest Retreat Land',
    description: 'Secluded forest land with hiking trails and wildlife. Perfect for eco-friendly home or retreat center. Solar-ready with well water access.',
    price: 72000,
    size: 7200,
    length: 120,
    breadth: 60,
    location: 'Forest Trail Road',
    city: 'Portland',
    state: 'Oregon',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      'https://images.unsplash.com/photo-1511497584788-876760111969?w=800',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'
    ]
  },
  {
    title: 'Urban Development Plot',
    description: 'Mixed-use development opportunity in growing urban area. Zoned for residential/commercial. Near public transit, schools, and shopping.',
    price: 195000,
    size: 5800,
    length: 116,
    breadth: 50,
    location: 'Urban Center Avenue',
    city: 'Austin',
    state: 'Texas',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800'
    ]
  },
  {
    title: 'Country Estate Land',
    description: 'Charming country property with rolling hills and pond. Ideal for equestrian estate or gentleman farm. Barn and fencing included.',
    price: 145000,
    size: 9500,
    length: 190,
    breadth: 50,
    location: 'Country Lane',
    city: 'Nashville',
    state: 'Tennessee',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800',
      'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800'
    ]
  },
  {
    title: 'Desert Oasis Land',
    description: 'Unique desert property with stunning rock formations and sunset views. Perfect for modern architectural home. Off-grid ready with solar potential.',
    price: 68000,
    size: 6500,
    length: 130,
    breadth: 50,
    location: 'Desert Vista Road',
    city: 'Sedona',
    state: 'Arizona',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800',
      'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800'
    ]
  },
  {
    title: 'Ski Resort Adjacent Land',
    description: 'Prime mountain land adjacent to popular ski resort. Year-round recreation opportunities. Perfect for luxury chalet or vacation rental investment.',
    price: 385000,
    size: 8500,
    length: 170,
    breadth: 50,
    location: 'Alpine Way',
    city: 'Aspen',
    state: 'Colorado',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1551524164-687a55dd1126?w=800',
      'https://images.unsplash.com/photo-1605540436563-5bca919ae766?w=800'
    ]
  },
  {
    title: 'Waterfront Marina Plot',
    description: 'Exclusive waterfront land with private marina access. Deep water dock included. Ideal for luxury waterfront home with boat storage.',
    price: 520000,
    size: 5200,
    length: 104,
    breadth: 50,
    location: 'Harbor View Drive',
    city: 'Miami',
    state: 'Florida',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1540202404-a2f29016b523?w=800',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800'
    ]
  },
  {
    title: 'Historic District Plot',
    description: 'Rare opportunity in historic downtown district. Zoned for boutique hotel or mixed-use development. Walking distance to museums and restaurants.',
    price: 425000,
    size: 4800,
    length: 96,
    breadth: 50,
    location: 'Heritage Street',
    city: 'Charleston',
    state: 'South Carolina',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800',
      'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800'
    ]
  },
  {
    title: 'Organic Farm Ready Land',
    description: 'Certified organic farmland with greenhouse and irrigation. Established customer base at farmers market. Includes farm equipment and storage.',
    price: 215000,
    size: 18000,
    length: 300,
    breadth: 60,
    location: 'Harvest Road',
    city: 'Eugene',
    state: 'Oregon',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=800',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'
    ]
  },
  {
    title: 'Tech Campus Development Site',
    description: 'Large parcel zoned for tech campus or corporate headquarters. Fiber optic ready, near major tech companies. Excellent for office park development.',
    price: 1200000,
    size: 25000,
    length: 500,
    breadth: 50,
    location: 'Innovation Boulevard',
    city: 'San Jose',
    state: 'California',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    ]
  },
  {
    title: 'Riverside Camping Resort Land',
    description: 'Beautiful riverside property perfect for RV park or glamping resort. Includes river access, utilities, and approved development plans.',
    price: 340000,
    size: 22000,
    length: 440,
    breadth: 50,
    location: 'River Bend Road',
    city: 'Bend',
    state: 'Oregon',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
      'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800'
    ]
  },
  {
    title: 'Airport Adjacent Commercial',
    description: 'Strategic location next to regional airport. Perfect for hotel, car rental, or aviation services. High visibility and traffic.',
    price: 680000,
    size: 15000,
    length: 300,
    breadth: 50,
    location: 'Airport Commerce Drive',
    city: 'Phoenix',
    state: 'Arizona',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
      'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=800'
    ]
  },
  {
    title: 'Hilltop Sunset View Estate',
    description: 'Breathtaking hilltop location with 360-degree views. Watch sunsets over the valley. Gated access, utilities to property line.',
    price: 295000,
    size: 7800,
    length: 156,
    breadth: 50,
    location: 'Summit Ridge',
    city: 'Santa Fe',
    state: 'New Mexico',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800'
    ]
  },
  {
    title: 'University District Investment',
    description: 'Prime location near major university. Perfect for student housing, apartments, or mixed-use development. High rental demand area.',
    price: 575000,
    size: 9200,
    length: 184,
    breadth: 50,
    location: 'College Avenue',
    city: 'Ann Arbor',
    state: 'Michigan',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800',
      'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800'
    ]
  },
  {
    title: 'Coastal Dunes Preserve Land',
    description: 'Protected coastal land with natural dunes and beach access. Eco-friendly development approved. Rare opportunity for sustainable coastal living.',
    price: 890000,
    size: 11000,
    length: 220,
    breadth: 50,
    location: 'Dunes Preserve Way',
    city: 'Outer Banks',
    state: 'North Carolina',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800'
    ]
  },
  {
    title: 'Agritourism Farm Land',
    description: 'Working farm with event barn and tasting room. Perfect for weddings, farm-to-table restaurant, or winery. Established business included.',
    price: 725000,
    size: 28000,
    length: 400,
    breadth: 70,
    location: 'Vineyard Lane',
    city: 'Sonoma',
    state: 'California',
    status: 'available',
    images: [
      'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800',
      'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?w=800'
    ]
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Land.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log(`Created ${createdUsers.length} users`);

    // Distribute lands among sellers
    const sellers = createdUsers.filter(u => u.userType === UserType.SELLER);
    const landsWithSeller = sampleLands.map((land, index) => ({
      ...land,
      seller: sellers[index % sellers.length]._id,
    }));

    const createdLands = await Land.create(landsWithSeller);
    console.log(`Created ${createdLands.length} lands`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Lands: ${createdLands.length}`);
    console.log('\n🔑 Admin Credentials:');
    console.log('   👤 Purav (Main Admin): purav@admin.com / 1234');
    console.log('   Admin: admin@example.com / admin123');
    console.log('\n🔑 Test Accounts:');
    console.log('   Seller: seller@example.com / seller123');
    console.log('   Buyer: buyer@example.com / buyer123');
    console.log('\n🏞️  12 land listings are now available with images!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
