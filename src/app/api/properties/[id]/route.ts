import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Listing, Review } from '@/models';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const property = await Listing.findById(params.id)
      .populate('hostId', 'id name avatar')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          select: 'id name avatar'
        },
        options: { sort: { createdAt: -1 } }
      });

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const property = await Listing.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    ).populate('hostId', 'id name avatar');

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    await Listing.findByIdAndDelete(params.id);

    return NextResponse.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
