import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city');
    const type = searchParams.get('type');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const guests = searchParams.get('guests');

    const where: any = {
      isActive: true
    };

    if (city) {
      where.city = city;
    }

    if (type) {
      where.type = type;
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (guests) {
      where.maxGuests = {
        gte: parseInt(guests)
      };
    }

    const properties = await db.listing.findMany({
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

    const property = await db.listing.create({
      data: {
        title,
        description,
        type,
        location,
        city,
        price: parseFloat(price),
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        maxGuests: parseInt(maxGuests),
        amenities: amenities ? JSON.stringify(amenities) : null,
        houseRules,
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

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
