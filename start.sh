#!/bin/sh
set -e

echo "🔍 Checking environment..."
echo "NODE_ENV: $NODE_ENV"
echo "DATABASE_URL: $DATABASE_URL"
echo "PORT: $PORT"

# Run migrations
echo "📦 Running Prisma migrations..."
pnpm prisma migrate deploy

# Verify database
echo "🔍 Verifying database..."
pnpm prisma db pull --force 2>/dev/null || echo "⚠️  Database verification skipped"

echo "✅ Database ready!"

# Start the application
echo "🚀 Starting application..."
node dist/main
