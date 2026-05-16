import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Listing } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const pricingType = searchParams.get('pricingType');
    const maxPrice = searchParams.get('maxPrice');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    const filter: any = {
      status: 'PUBLISHED',
      targetAudience: 'STUDENTS'
    };

    if (city) {
      filter.city = { $regex: city, $options: 'i' };
    }

    if (pricingType) {
      filter.pricingType = pricingType;
    }

    if (maxPrice) {
      filter.price = { $lte: parseFloat(maxPrice) };
    }

    const skip = (page - 1) * limit;

    const [listings, total] = await Promise.all([
      Listing.find(filter)
        .populate('hostId', 'id name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Listing.countDocuments(filter)
    ]);

    return NextResponse.json({
      success: true,
      data: listings,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching student listings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch student listings' },
      { status: 500 }
    );
  }
}
