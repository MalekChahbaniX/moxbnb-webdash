import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Listing } from '@/models';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const guests = searchParams.get('guests');

    const filter: any = {
      isActive: true
    };

    if (city) {
      filter.city = city;
    }

    if (type) {
      filter.type = type;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    if (guests) {
      filter.maxGuests = {
        $gte: parseInt(guests)
      };
    }

    const properties = await Listing.find(filter)
      .populate('hostId', 'id name avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const {
      title,
      description,
      type,
      location,
      city,
      price,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
      houseRules,
      images,
      hostId
    } = body;

    const property = await Listing.create({
      title,
      description,
      type,
      location,
      city,
      price: parseFloat(price),
      bedrooms: parseInt(bedrooms),
      bathrooms: parseInt(bathrooms),
      maxGuests: parseInt(maxGuests),
      amenities,
      houseRules,
      images,
      hostId
    });

    await property.populate('hostId', 'id name avatar');

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
