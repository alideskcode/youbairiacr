import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/marketers - Get marketers (public listing)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const specialty = searchParams.get('specialty');
    const minRating = searchParams.get('minRating');

    const where: any = {
      status: 'ACTIVE',
    };

    if (specialty) {
      where.specialties = {
        array_contains: [specialty],
      };
    }

    if (minRating) {
      where.rating = {
        gte: parseFloat(minRating),
      };
    }

    const marketers = await prisma.marketer.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        rating: 'desc',
      },
    });

    return NextResponse.json({ marketers });
  } catch (error) {
    console.error('Error fetching marketers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch marketers' },
      { status: 500 }
    );
  }
}

// POST /api/marketers - Register as marketer
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { marketer: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.marketer) {
      return NextResponse.json(
        { error: 'User is already registered as a marketer' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { bio, specialties, portfolio, socialLinks } = body;

    // Validate required fields
    if (!bio || !specialties || !Array.isArray(specialties)) {
      return NextResponse.json(
        { error: 'Bio and specialties are required' },
        { status: 400 }
      );
    }

    // Update user role to MARKETER
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'MARKETER' },
    });

    const marketer = await prisma.marketer.create({
      data: {
        userId: user.id,
        bio,
        specialties,
        portfolio,
        socialLinks,
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({ marketer }, { status: 201 });
  } catch (error) {
    console.error('Error creating marketer:', error);
    return NextResponse.json(
      { error: 'Failed to create marketer profile' },
      { status: 500 }
    );
  }
}
