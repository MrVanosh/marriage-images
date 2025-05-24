import type { NextRequest } from 'next/server';
import { Buffer } from 'node:buffer';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { db } from '@/libs/DB';
import { Env } from '@/libs/Env';
import { imagesSchema } from '@/models/Schema';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { NextResponse } from 'next/server';

// Configure S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: Env.R2_PUBLIC_URL,
  credentials: {
    accessKeyId: Env.R2_ACCESS_KEY_ID,
    secretAccessKey: Env.R2_SECRET_ACCESS_KEY,
  },
});

// Ensure upload directory exists
const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
await mkdir(UPLOAD_DIR, { recursive: true }).catch(() => {});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const uploaderName = formData.get('uploaderName') as string | null;
    const description = formData.get('description') as string | null;

    const uploadResults: any[] = [];

    // Process each file
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('file-') && value instanceof File) {
        const file = value;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/png', 'image/heic', 'image/heif'];
        if (!validTypes.includes(file.type.toLowerCase())) {
          return NextResponse.json(
            { error: 'Invalid file type' },
            { status: 400 },
          );
        }

        // Validate file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'File too large' },
            { status: 400 },
          );
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const uniqueFilename = `${nanoid()}.${fileExt}`;

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Save locally first for immediate response
        const localPath = join(UPLOAD_DIR, uniqueFilename);
        await writeFile(localPath, buffer);

        // Save to database with local URL first
        const localUrl = `/uploads/${uniqueFilename}`;
        await db.insert(imagesSchema).values({
          fileName: file.name,
          fileUrl: localUrl,
          mimeType: file.type,
          fileSize: file.size,
          uploaderName: uploaderName || null,
          description: description || null,
        });

        uploadResults.push({
          success: true,
          url: localUrl,
          filename: uniqueFilename,
        });

        // Upload to R2 in background (non-blocking)
        uploadToR2InBackground(buffer, uniqueFilename, file.type);
      }
    }

    if (uploadResults.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      files: uploadResults,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 },
    );
  }
}

// Background upload to R2
async function uploadToR2InBackground(
  buffer: Buffer,
  filename: string,
  contentType: string,
) {
  try {
    const uploadCommand = new PutObjectCommand({
      Bucket: Env.R2_BUCKET_NAME,
      Key: filename,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(uploadCommand);

    // Update database with R2 URL
    const r2Url = `${Env.R2_PUBLIC_URL}/${filename}`;
    await db.update(imagesSchema)
      .set({ fileUrl: r2Url })
      .where(eq(imagesSchema.fileName, filename));
  } catch (error) {
    console.error(`Failed to upload ${filename} to R2:`, error);
    // Could implement retry logic here
  }
}
