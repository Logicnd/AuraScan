import { NextResponse } from 'next/server';
import { runSecureScan } from '../../../lib/secureScan';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = typeof body?.input === 'string' ? body.input.trim() : '';

    if (!input) {
      return NextResponse.json(
        { error: 'Input required.' },
        {
          status: 400
        }
      );
    }

    const payload = runSecureScan(input);
    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(
      { error: 'Unable to parse request.' },
      {
        status: 400
      }
    );
  }
}
