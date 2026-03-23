import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Service } from '@/models';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const available = searchParams.get('available');

    const filter: any = {};

    if (type) {
      filter.type = type;
    }

    if (available !== null) {
      filter.isAvailable = available === 'true';
    }

    const services = await Service.find(filter)
      .populate('provider', 'id name email phone')
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
    
    await service.populate('provider', 'id name email');

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { serviceId, updateData } = body;

    const service = await Service.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true }
    ).populate('provider', 'id name email');

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');

    await Service.findByIdAndDelete(serviceId);

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}
