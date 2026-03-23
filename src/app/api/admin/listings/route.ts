import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Listing } from '@/models';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const filter: any = {};

    if (status && status !== 'all') {
      filter.isActive = status === 'approved';
    }

    const listings = await Listing.find(filter)
      .populate('host', 'id name email phone')
      .sort({ createdAt: -1 });

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { listingId, action } = body;

    let updateData: any = {};
    
    if (action === 'approve') {
      updateData.isActive = true;
    } else if (action === 'reject') {
      updateData.isActive = false;
    }

    const listing = await Listing.findByIdAndUpdate(
      listingId,
      updateData,
      { new: true }
    ).populate('host', 'id name email');

    return NextResponse.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    return NextResponse.json(
      { error: 'Failed to update listing' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('id');

    await Listing.findByIdAndDelete(listingId);

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
