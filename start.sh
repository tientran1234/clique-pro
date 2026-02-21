#!/bin/sh
set -e

echo "🔍 Checking database..."

# Run migrations
echo "📦 Running Prisma migrations..."
pnpm prisma migrate deploy

echo "✅ Database ready!"

# Start the application
echo "🚀 Starting application..."
pnpm start:prod
