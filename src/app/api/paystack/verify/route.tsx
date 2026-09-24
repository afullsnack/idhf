// app/api/paystack/verify/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get('reference');

  if (!reference) {
    return NextResponse.json({ status: 'error', message: 'No reference supplied' }, { status: 400 });
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SK}`,
    },
  });

	const data = await res.json();

	console.log(`[SERVER]: Data response`, {data})

  if (data.status && data.data.status === 'success') {
    // Payment confirmed — fulfill the order, update your DB, etc.
    // Also check data.data.amount matches what you expected!
    return NextResponse.json({ status: 'success', data: data.data });
  }

  return NextResponse.json({ status: 'failed', data: data.data });
}
