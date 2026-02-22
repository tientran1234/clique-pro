#!/bin/sh
set -e

echo "======================================"
echo "🚀 Starting Clique Backend Deployment"
echo "======================================"

echo ""
echo "🔍 Environment Check:"
echo "  NODE_ENV: $NODE_ENV"
echo "  PORT: $PORT"
echo "  DATABASE_URL: ${DATABASE_URL:0:30}..." 

echo ""
echo "======================================"
echo "📦 Running Prisma Migrations..."
echo "======================================"

# Run migrations with explicit schema path
pnpm prisma migrate deploy --schema=./prisma/schema.prisma

echo ""
echo "✅ Migrations completed successfully!"

echo ""
echo "🔍 Verifying database tables..."
# Check if tables exist by listing them
pnpm prisma db execute --stdin --schema=./prisma/schema.prisma <<SQL
SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;
SQL

echo ""
echo "======================================"
echo "🚀 Starting NestJS Application..."
echo "======================================"
node dist/main
