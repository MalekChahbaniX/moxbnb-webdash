import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/models';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const bookings = await Booking.find({ userId })
      .populate('user', 'id name email')
      .sort({ createdAt: -1 });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      type,
      itemId,
      userId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      specialRequests
    } = body;

    const booking = await Booking.create({
      type,
      itemId,
      userId,
      checkIn: checkIn ? new Date(checkIn) : null,
      checkOut: checkOut ? new Date(checkOut) : null,
      guests: parseInt(guests),
      totalPrice: parseFloat(totalPrice),
      specialRequests
    });
    
    await booking.populate('user', 'id name email');

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
