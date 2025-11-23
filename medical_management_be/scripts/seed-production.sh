#!/bin/sh
# Script để seed database ở production một cách an toàn
# Chỉ seed khi database trống hoặc có flag FORCE_SEED=true

set -e

echo "=========================================="
echo "Production Database Seed Script"
echo "=========================================="
echo ""

# Kiểm tra DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL is not set"
  exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Kiểm tra xem database có dữ liệu không
echo "Checking if database has existing data..."
EXISTING_COUNT=$(npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM \"User\";" 2>/dev/null | grep -o '[0-9]*' | head -1 || echo "0")

if [ "$EXISTING_COUNT" -gt 0 ]; then
  echo "⚠️  WARNING: Database already has $EXISTING_COUNT users"
  echo ""
  
  if [ "$FORCE_SEED" != "true" ]; then
    echo "❌ Seed aborted to prevent data loss."
    echo ""
    echo "To force seed (will DELETE ALL DATA), run:"
    echo "  FORCE_SEED=true yarn db:seed"
    echo ""
    exit 1
  else
    echo "⚠️  FORCE_SEED=true detected. This will DELETE ALL DATA!"
    echo "Waiting 5 seconds... (Press Ctrl+C to cancel)"
    sleep 5
  fi
fi

echo "Starting seed..."
echo ""

# Chạy seed
yarn db:seed

echo ""
echo "✅ Seed completed successfully!"
echo ""

