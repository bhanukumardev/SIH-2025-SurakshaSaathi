import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { saveUser, getUserByEmail } from '../../../../lib/userStore';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!['student', 'teacher', 'parent', 'admin'].includes(role)) {
      return NextResponse.json(
        { message: "Invalid role" },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    const hash = await bcrypt.hash(password, 12);
    const user = { id: uuidv4(), name, email, passwordHash: hash, role };
    await saveUser(user);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
