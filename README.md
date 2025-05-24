# Wedding Photo Upload App

A minimalistic web application for wedding guests to easily upload and share photos from the wedding celebration.

## Features

- 📸 Easy photo upload with drag-and-drop support
- 🌍 Multi-language support (English, Polish, Ukrainian)
- ☁️ Cloud storage with Cloudflare R2
- 📱 Mobile-friendly responsive design
- 🎨 Clean, minimalistic white design
- ♿ Accessibility-focused implementation

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Database**: PostgreSQL with Drizzle ORM
- **Storage**: Cloudflare R2 (S3-compatible)
- **Internationalization**: next-intl
- **Type Safety**: TypeScript
- **Form Validation**: Zod

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
npm install
```

3. Copy `.env.example` to `.env` and configure:
   ```env
   # Database URL (optional - uses PGlite for local development)
   DATABASE_URL=

   # Cloudflare R2 Configuration
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key_id
   R2_SECRET_ACCESS_KEY=your_secret_access_key
   R2_BUCKET_NAME=wedding-photos
   R2_PUBLIC_URL=https://your-r2-public-domain.com
   ```

4. Run database migrations:
   ```bash
npm run db:generate
   npm run db:migrate
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

## Cloudflare R2 Setup

1. Create a Cloudflare account and enable R2
2. Create a new R2 bucket
3. Set up public access for the bucket
4. Create API tokens with R2 read/write permissions
5. Configure CORS settings for your domain

## Deployment

The app is ready to deploy on Vercel, Netlify, or any platform supporting Next.js.

## Usage

1. Guests scan the QR code or visit the website
2. Select photos to upload (supports JPG, PNG, HEIC)
3. Optionally add their name and a message
4. Photos are uploaded to cloud storage
5. Gallery feature coming soon!

## License

MIT
