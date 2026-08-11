import { NextResponse } from 'next/server';
import { removeAuthToken } from '@/lib/cookies';

export async function POST() {
  try {
    await removeAuthToken();
    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
    response.cookies.set('token', '', { maxAge: 0, path: '/' });
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
