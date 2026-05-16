import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Experience } from '@/models';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const filter: any = {
      isActive: true
    };

    if (category) {
      filter.category = category;
    }

    if (city) {
      filter.city = city;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    const experiences = await Experience.find(filter)
      .populate('hostId', 'id name email avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
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
      category,
      location,
      city,
      price,
      duration,
      maxGuests,
      requirements,
      images,
      hostId
    } = body;

    const experience = await Experience.create({
      title,
      description,
      category,
      location,
      city,
      price: parseFloat(price),
      duration,
      maxGuests: parseInt(maxGuests),
      requirements,
      images: images || [],
      hostId
    });
    
    await experience.populate('hostId', 'id name avatar');

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
