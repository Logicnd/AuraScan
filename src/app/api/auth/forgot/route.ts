import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    { error: 'Password resets are temporarily disabled. Please create a new account.' },
    { status: 404 },
  );
}
