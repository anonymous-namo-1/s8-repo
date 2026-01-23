# Syntheight - Premium Digital Assets Platform

## Overview
Syntheight is a full-stack e-commerce platform for selling automation workflows and digital assets. It features a React frontend with a FastAPI backend connected to MongoDB.

## Project Architecture

### Frontend (React)
- **Location**: `frontend/`
- **Port**: 5000
- **Framework**: React with CRACO (Create React App Configuration Override)
- **Styling**: Tailwind CSS with Radix UI components
- **Routing**: React Router DOM

### Backend (FastAPI)
- **Location**: `backend/`
- **Port**: 8000
- **Database**: MongoDB (via Motor async driver)
- **Payment**: Razorpay integration (optional)
- **Email**: Resend API (optional)

## Environment Variables Required

### Required
- `MONGO_URL` - MongoDB connection string
- `DB_NAME` - MongoDB database name

### Optional (for full functionality)
- `RAZORPAY_KEY_ID` - Razorpay API Key ID
- `RAZORPAY_KEY_SECRET` - Razorpay API Secret
- `RAZORPAY_WEBHOOK_SECRET` - Razorpay Webhook Secret
- `RESEND_API_KEY` - Resend email API key
- `FROM_EMAIL` - Sender email address
- `JWT_SECRET` - JWT token signing secret
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)

## Running the Application

The application uses two workflows:
1. **Frontend**: React development server on port 5000
2. **Backend**: FastAPI server on port 8000

## API Endpoints

- `GET /api/` - Health check
- `POST /api/status` - Create status check
- `GET /api/status` - Get status checks
- `POST /api/orders/create` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `POST /api/auth/*` - Authentication endpoints
- `POST /api/contact` - Contact form

## Recent Changes
- Configured for Replit environment
- Made Razorpay integration optional (app works without payment credentials)
- Frontend configured to run on port 5000 with all hosts allowed
- Backend configured to run on port 8000
- Added device-friendly 3D animated background using Three.js/React Three Fiber (January 2026)

## 3D Background Animation

### Features
- **3D Geometric Shapes**: Floating cubes, pyramids, octahedrons, torus knots, icosahedrons, dodecahedrons, and more
- **Particle System**: Ambient floating particles across the scene
- **Interactive Lighting**: Mouse-following point light for desktop users
- **3D Grid Plane**: Subtle perspective grid in the background
- **Device Optimization**: Three performance tiers (full, reduced, minimal) based on device capabilities

### Technical Implementation
- **Location**: `frontend/src/components/Background3D.jsx`
- **Libraries**: three, @react-three/fiber, @react-three/drei
- **Fallback**: CSS-based 3D animation for devices without WebGL support
- **Performance**: Automatic quality adjustment based on device memory, CPU cores, and screen size

### Performance Tiers
1. **Full** (Desktop): All effects, 8 geometries, 200 particles, mouse tracking, grid plane
2. **Reduced** (Tablet/Touch): 4 geometries, 100 particles, simplified effects
3. **Minimal** (Mobile/Low-end): 2 geometries, 30 particles, basic animations
