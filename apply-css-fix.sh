#!/bin/bash

# AR Compare CSS Fix Script
# This script applies the unified CSS solution

echo "🔧 AR Compare CSS Fix Script"
echo "============================"
echo ""

# Check if we're in the right directory
if [ ! -f "app/globals.css" ]; then
    echo "❌ Error: app/globals.css not found. Are you in the ar-compare-nextjs directory?"
    exit 1
fi

echo "📋 Current CSS files:"
ls -la app/globals*.css
echo ""

# Backup current globals.css
echo "📦 Creating backup of current globals.css..."
cp app/globals.css "app/globals-backup-$(date +%Y%m%d-%H%M%S).css"
echo "✅ Backup created"
echo ""

# Apply the unified CSS
echo "🚀 Applying unified CSS solution..."
if [ -f "app/globals-unified.css" ]; then
    cp app/globals-unified.css app/globals.css
    echo "✅ Unified CSS applied successfully!"
else
    echo "❌ Error: app/globals-unified.css not found"
    echo "Make sure the unified CSS file was created first"
    exit 1
fi

echo ""
echo "🧹 Cleaning Next.js cache..."
rm -rf .next
echo "✅ Cache cleared"

echo ""
echo "✨ CSS fix applied successfully!"
echo ""
echo "Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Test the main page at http://localhost:3000"
echo "3. Test a product page at http://localhost:3000/products/[id]"
echo "4. If issues occur, restore from backup: app/globals-backup-*.css"
echo ""
echo "📚 See CSS_MIGRATION_GUIDE.md for detailed information"