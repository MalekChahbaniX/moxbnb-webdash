import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const city = searchParams.get('city');
    const available = searchParams.get('available');

    const where: any = {};

    if (type) {
      where.type = type;
    }

    if (city) {
      where.city = city;
    }

    if (available !== null) {
      where.isAvailable = available === 'true';
    }

    const services = await db.service.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

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

    const service = await db.service.create({
      data: {
        title,
        description,
        type,
        location,
        city,
        price: parseFloat(price),
        duration,
        providerId
      },
      include: {
        provider: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}
