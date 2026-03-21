import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const makeId = searchParams.get('makeId');

    if (makeId) {
      // Return models for a specific make
      const models = await prisma.vehicleModel.findMany({
        where: { makeId },
        select: { id: true, name: true },
        orderBy: { name: 'asc' },
      });
      return NextResponse.json({ models });
    }

    // Return all makes
    const makes = await prisma.vehicleMake.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
    return NextResponse.json({ makes });
  } catch (error) {
    console.error('Vehicles fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
