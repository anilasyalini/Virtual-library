import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const category = searchParams.get('category');

        const resources = await prisma.resource.findMany({
            where: {
                AND: [
                    query ? {
                        OR: [
                            { title: { contains: query } },
                            { description: { contains: query } },
                        ],
                    } : {},
                    category && category !== 'All' ? { category: category } : {},
                ],
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json(resources);
    } catch (error) {
        console.error('Fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
