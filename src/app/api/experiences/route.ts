import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const city = searchParams.get('city');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    const where: any = {
      isActive: true
    };

    if (category) {
      where.category = category;
    }

    if (city) {
      where.city = city;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    const experiences = await db.experience.findMany({
      where,
      include: {
        host: {
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

    const experience = await db.experience.create({
      data: {
        title,
        description,
        category,
        location,
        city,
        price: parseFloat(price),
        duration,
        maxGuests: parseInt(maxGuests),
        requirements,
        images: images ? JSON.stringify(images) : null,
        hostId
      },
      include: {
        host: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Error creating experience:', error);
    return NextResponse.json(
      { error: 'Failed to create experience' },
      { status: 500 }
    );
  }
}
