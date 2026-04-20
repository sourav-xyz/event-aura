import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Forward the booking request to the backend API
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to create booking' },
        { status: response.status }
      );
    }

    // Extract the data from backend response
    const responseData = {
      success: true,
      message: data.message || 'Booking created successfully',
      data: data.data || {
        _id: data.order?._id,
        orderNumber: data.order?.orderNumber,
        trackingId: data.order?.orderNumber,
        status: data.order?.status,
        contactInfo: data.order?.contactInfo,
        eventDetails: data.order?.eventDetails,
        pricing: data.order?.pricing,
        createdAt: data.order?.createdAt
      }
    };
    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Booking proxy error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();

    // Forward the GET request to the backend API
    const response = await fetch(`${API_URL}/orders/my-orders${query ? '?' + query : ''}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Failed to fetch bookings' },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
