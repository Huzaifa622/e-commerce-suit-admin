import { NextResponse } from 'next/server';
import { saveAuthToken } from '@/lib/cookies';
import connectDb from '@/lib/db/connect-db';
import { User } from '@/models/user-model';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await connectDb();
    const { email, password } = await request.json();

    // Simplified auth for scaffolding purposes
    const user = await User.findOne({ email });
    
    // In production, compare hashed passwords using bcrypt
    const isMatch = user && user.password ? await bcrypt.compare(password, user.password) : false;
    
    if (!user || !isMatch) { 
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT in production. Here we just set a mock token cookie
    const token = 'mock-jwt-token';
    await saveAuthToken(token);

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
