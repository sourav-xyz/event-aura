import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Booking from '@/lib/db/models/Booking';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const trackingId = searchParams.get('trackingId');
    const email = searchParams.get('email');

    if (!trackingId) {
      return NextResponse.json(
        { success: false, message: 'Tracking ID is required' },
        { status: 400 }
      );
    }

    // Find booking by tracking ID
    const query: Record<string, string> = { trackingId };
    
    // Optionally verify with email for extra security
    if (email) {
      query.email = email.toLowerCase();
    }

    const booking = await Booking.findOne(query)
      .select('trackingId name eventType eventDate venue guestCount packageType status createdAt')
      .lean();

    if (!booking) {
      return NextResponse.json(
        { success: false, message: 'Booking not found. Please check your tracking ID.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error: unknown) {
    console.error('Track booking error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to track booking';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
