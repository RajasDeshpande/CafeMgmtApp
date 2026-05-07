require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');

const demoMenu = [
  { name: 'Espresso', description: 'Rich single shot of pure Arabica espresso.', price: 150, category: 'Beverages', image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400', inStock: true, isVeg: true, orderCount: 42 },
  { name: 'Cappuccino', description: 'Double espresso with velvety steamed milk and silky microfoam.', price: 200, category: 'Beverages', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', inStock: true, isVeg: true, orderCount: 67 },
  { name: 'Iced Latte', description: 'Chilled espresso over ice topped with creamy cold milk.', price: 220, category: 'Beverages', image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400', inStock: true, isVeg: true, orderCount: 53 },
  { name: 'Matcha Latte', description: 'Ceremonial-grade Japanese matcha whisked with oat milk.', price: 250, category: 'Beverages', image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400', inStock: true, isVeg: true, orderCount: 31 },
  { name: 'Fresh Orange Juice', description: 'Freshly squeezed oranges, no added sugar.', price: 180, category: 'Beverages', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', inStock: true, isVeg: true, orderCount: 25 },
  { name: 'Butter Croissant', description: 'Flaky golden-brown French croissant with real butter.', price: 120, category: 'Snacks', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400', inStock: true, isVeg: true, orderCount: 38 },
  { name: 'Avocado Toast', description: 'Smashed avocado on sourdough with tomatoes and microgreens.', price: 280, category: 'Snacks', image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=400', inStock: true, isVeg: true, orderCount: 45 },
  { name: 'Chicken Club Sandwich', description: 'Grilled chicken, bacon, lettuce, tomato, garlic aioli.', price: 320, category: 'Snacks', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400', inStock: true, isVeg: false, orderCount: 29 },
  { name: 'Veggie Wrap', description: 'Hummus, roasted veggies, feta cheese in whole wheat wrap.', price: 250, category: 'Snacks', image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400', inStock: true, isVeg: true, orderCount: 22 },
  { name: 'Margherita Pizza', description: 'Wood-fired thin crust with mozzarella, tomatoes, and basil.', price: 350, category: 'Mains', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', inStock: true, isVeg: true, orderCount: 58 },
  { name: 'Pasta Alfredo', description: 'Creamy fettuccine alfredo with parmesan and nutmeg.', price: 320, category: 'Mains', image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400', inStock: true, isVeg: true, orderCount: 41 },
  { name: 'Grilled Chicken Bowl', description: 'Herb chicken over quinoa with roasted veggies and tahini.', price: 380, category: 'Mains', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', inStock: true, isVeg: false, orderCount: 35 },
  { name: 'Paneer Tikka Platter', description: 'Tandoori paneer with mint chutney, onion rings, and naan.', price: 340, category: 'Mains', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=400', inStock: true, isVeg: true, orderCount: 47 },
  { name: 'Chocolate Brownie', description: 'Fudgy dark chocolate brownie with vanilla ice cream.', price: 220, category: 'Desserts', image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400', inStock: true, isVeg: true, orderCount: 52 },
  { name: 'Tiramisu', description: 'Espresso-soaked ladyfingers with mascarpone and cocoa.', price: 280, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400', inStock: true, isVeg: true, orderCount: 39 },
  { name: 'New York Cheesecake', description: 'Baked cheesecake with graham crust and berry compote.', price: 260, category: 'Desserts', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', inStock: true, isVeg: true, orderCount: 33 },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    const inserted = await MenuItem.insertMany(demoMenu);
    console.log(`Seeded ${inserted.length} menu items`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
