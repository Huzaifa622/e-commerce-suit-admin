import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/user-model';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function seedAdmin() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce-admin';
    
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'admin@admin.com';
    const plainPassword = 'Password123!';

    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    await User.create({
      name: 'Super Admin',
      email: email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('Admin user seeded successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${plainPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
}

seedAdmin();
