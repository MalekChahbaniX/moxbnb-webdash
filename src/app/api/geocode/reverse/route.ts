import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory cache (reset on server restart)
const geocodeCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const zoom = searchParams.get('zoom') || '18';

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing lat or lon parameter' },
      { status: 400 }
    );
  }

  // Round coordinates to 4 decimal places for cache key
  const cacheKey = `${parseFloat(lat).toFixed(4)},${parseFloat(lon).toFixed(4)}`;
  
  // Check cache
  const cached = geocodeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=${zoom}&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'MoxBnB-App/1.0',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited - return cached data if available, even if expired
        if (cached) {
          return NextResponse.json(cached.data);
        }
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        );
      }
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Cache the result
    geocodeCache.set(cacheKey, { data, timestamp: Date.now() });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Geocoding error:', error);
    
    // Return cached data if available on error
    if (cached) {
      return NextResponse.json(cached.data);
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch address' },
      { status: 500 }
    );
  }
}
