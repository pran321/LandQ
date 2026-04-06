#!/bin/bash

echo "🚀 Land Selling Platform - Installation Script"
echo "=============================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Check MongoDB
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo "⚠️  MongoDB CLI not found. Make sure MongoDB is installed or use MongoDB Atlas."
else
    echo "✅ MongoDB is available"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Backend installation failed"
    exit 1
fi
echo "✅ Backend dependencies installed"

# Create uploads directory
mkdir -p uploads
echo "✅ Created uploads directory"

# Copy .env.example to .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created backend/.env file (please update with your configuration)"
fi

cd ..

# Install frontend dependencies
echo ""
echo "Installing frontend dependencies..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Frontend installation failed"
    exit 1
fi
echo "✅ Frontend dependencies installed"

# Copy .env.example to .env if not exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created frontend/.env file"
fi

cd ..

echo ""
echo "=============================================="
echo "✅ Installation completed successfully!"
echo "=============================================="
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Update backend/.env with your MongoDB URI and JWT secret"
echo "2. (Optional) Seed sample data: cd backend && npm run seed"
echo "3. Start development servers: npm run dev"
echo ""
echo "Or start them separately:"
echo "  Backend:  cd backend && npm run dev"
echo "  Frontend: cd frontend && npm run dev"
echo ""
echo "📚 Documentation:"
echo "  - Quick Start: QUICK_START.md"
echo "  - Setup Guide: SETUP_GUIDE.md"
echo "  - API Docs: API_DOCUMENTATION.md"
echo ""
echo "🌐 Access:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "Happy coding! 🎉"
