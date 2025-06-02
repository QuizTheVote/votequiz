#!/bin/bash
# Election Quiz App Deployment Script

echo "🚀 Starting deployment process for Election Quiz App..."

# Ensure we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root."
  exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  echo "❌ Error: npm could not be found. Please install Node.js and npm."
  exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run tests if they exist
if grep -q "\"test\":" package.json; then
  echo "🧪 Running tests..."
  npm test
fi

# Build the app
echo "🔨 Building the application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
  echo "❌ Build failed! Please check for errors above."
  exit 1
fi

echo "✅ Build successful!"
echo "📁 The build files are located in the 'build' directory."
echo ""
echo "🌍 DEPLOYMENT INSTRUCTIONS:"
echo "1. Upload the contents of the 'build' directory to your web hosting service."
echo "2. For GitHub Pages: deploy the 'build' directory contents to the 'gh-pages' branch."
echo "3. For Netlify/Vercel: connect your repository and set the build command to 'npm run build'."
echo ""
echo "🔗 If using Google Sheets, remember to update the SHEET_ID in src/routes/+page.svelte"
echo "   and set USE_SAMPLE_DATA = false before deploying."

# Optional: create a zip file for easier manual uploading
echo "📦 Creating election-quiz-app.zip file with build contents..."
cd build && zip -r ../election-quiz-app.zip . && cd ..

echo "🎉 Deployment preparation complete!" 