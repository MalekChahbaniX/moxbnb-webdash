import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Service } from '@/models';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const available = searchParams.get('available');

    const filter: any = {};

    if (type) {
      filter.$or = [{ type }, { category: type }];
    }

    if (city) {
      filter.city = city;
    }

    if (available !== null) {
      filter.isAvailable = available === 'true';
    }

    const services = await Service.find(filter)
      .populate('providerId', 'id name email phone avatar')
      .sort({ createdAt: -1 });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
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
      duration,
      providerId
    } = body;

    const service = await Service.create({
      title,
      description,
      type,
      location,
      city,
      price: parseFloat(price),
      duration,
      providerId
    });
    
    await service.populate('provider', 'id name avatar');

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
