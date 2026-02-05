import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
    let query: string | null = null;
    let category: string | null = null;
    try {
        const { searchParams } = new URL(request.url);
        query = searchParams.get('q');
        category = searchParams.get('category');

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
        console.error('Fetch resources error details:', {
            error,
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
            query,
            category
        });
        return NextResponse.json({
            error: 'Internal Server Error',
            message: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
