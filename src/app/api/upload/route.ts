import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/db';
import { z } from 'zod';

const uploadSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(100),
    description: z.string().max(500).optional(),
    category: z.enum(['Computer Science', 'Mathematics', 'Physics', 'Business', 'Literature', 'Uncategorized']),
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category = formData.get('category') as string;

        // 1. Validate File existence and basic properties
        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 400 });
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json({ error: 'Invalid file type. Only PDF and images are allowed.' }, { status: 400 });
        }

        // 2. Validate metadata with Zod
        const validation = uploadSchema.safeParse({ title, description, category });
        if (!validation.success) {
            return NextResponse.json({
                error: 'Validation failed',
                details: validation.error.flatten().fieldErrors
            }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const uploadPath = path.join(process.cwd(), 'public', 'uploads', fileName);

        await writeFile(uploadPath, buffer);

        const resource = await prisma.resource.create({
            data: {
                title: validation.data.title,
                description: validation.data.description || '',
                fileName: fileName,
                fileUrl: `/uploads/${fileName}`,
                fileType: file.type,
                category: validation.data.category,
            },
        });

        return NextResponse.json({ success: true, resource });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
