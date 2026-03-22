import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};

    if (status && status !== 'all') {
      where.isActive = status === 'approved';
    }

    const listings = await db.listing.findMany({
      where,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

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
    const body = await request.json();
    const { listingId, action } = body;

    let updateData: any = {};
    
    if (action === 'approve') {
      updateData.isActive = true;
    } else if (action === 'reject') {
      updateData.isActive = false;
    }

    const listing = await db.listing.update({
      where: { id: listingId },
      data: updateData,
      include: {
        host: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

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
    const { searchParams } = new URL(request.url);
    const listingId = searchParams.get('id');

    await db.listing.delete({
      where: { id: listingId as string }
    });

    return NextResponse.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    return NextResponse.json(
      { error: 'Failed to delete listing' },
      { status: 500 }
    );
  }
}
