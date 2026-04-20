import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Booking from '@/lib/db/models/Booking';
import { sendEmail, getBookingConfirmationEmail, getAdminNotificationEmail } from '@/lib/email/sendEmail';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    
    const {
      name,
      email,
      phone,
      eventType,
      eventDate,
      guestCount,
      venue,
      packageType,
      customServices,
      additionalNotes,
    } = body;

    // Validate required fields
    if (!name || !email || !phone || !eventType || !eventDate || !guestCount || !venue || !packageType) {
      return NextResponse.json(
        { success: false, message: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Create booking
    const booking = await Booking.create({
      name,
      email,
      phone,
      eventType,
      eventDate: new Date(eventDate),
      guestCount: parseInt(guestCount),
      venue,
      packageType,
      customServices: customServices || [],
      additionalNotes,
      status: 'pending',
    });

    // Send confirmation email to customer
    const customerEmailHtml = getBookingConfirmationEmail({
      trackingId: booking.trackingId,
      name: booking.name,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      packageType: booking.packageType,
      venue: booking.venue,
      guestCount: booking.guestCount,
    });

    await sendEmail({
      to: booking.email,
      subject: `Booking Confirmed - ${booking.trackingId}`,
      html: customerEmailHtml,
    });

    // Send notification email to admin
    if (process.env.ADMIN_EMAIL) {
      const adminEmailHtml = getAdminNotificationEmail({
        trackingId: booking.trackingId,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        eventType: booking.eventType,
        eventDate: booking.eventDate,
        packageType: booking.packageType,
        venue: booking.venue,
        guestCount: booking.guestCount,
        additionalNotes: booking.additionalNotes,
      });

      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `New Booking Received - ${booking.trackingId}`,
        html: adminEmailHtml,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Booking created successfully',
      data: {
        trackingId: booking.trackingId,
        id: booking._id,
      },
    });
  } catch (error: unknown) {
    console.error('Booking creation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const query: Record<string, string> = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const [bookings, total] = await Promise.all([
      Booking.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    console.error('Fetch bookings error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}
