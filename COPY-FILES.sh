#!/bin/bash

# Script to copy all necessary files for the Harsh Phalke website

echo "Creating project structure..."

# Create directories
mkdir -p harsh-phalke-website/src/app
mkdir -p harsh-phalke-website/src/styles
mkdir -p harsh-phalke-website/src/imports

# Copy main files
echo "Copying files..."
cp package.json harsh-phalke-website/
cp vite.config.ts harsh-phalke-website/
cp tsconfig.json harsh-phalke-website/ 2>/dev/null

# Copy source files
cp src/app/App.tsx harsh-phalke-website/src/app/
cp src/styles/fonts.css harsh-phalke-website/src/styles/
cp src/styles/theme.css harsh-phalke-website/src/styles/

# Copy images
cp src/imports/WhatsApp_Image_2026-05-22_at_10.00.08_PM.jpeg harsh-phalke-website/src/imports/ 2>/dev/null
cp src/imports/WhatsApp_Image_2026-05-22_at_10.00.07_PM.jpeg harsh-phalke-website/src/imports/ 2>/dev/null

echo "Done! Your project is in the 'harsh-phalke-website' folder"
echo ""
echo "Next steps:"
echo "  cd harsh-phalke-website"
echo "  npm install"
echo "  npm run dev"
