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
- **Interactive Blue Dot Grid**: A responsive grid of blue dots covering the background
- **Click-Triggered Ripple Waves**: Clicking anywhere creates a wave that spreads outward in all directions
- **3D Illusion**: Dots scale and shift position to create depth and 3D wave effect
- **Ambient Animation**: Continuous subtle wave movement even without interaction
- **Multiple Overlapping Waves**: Each click adds a new wave that interacts with existing ones
- **Device Optimization**: Three performance tiers based on device capabilities

### Technical Implementation
- **Location**: `frontend/src/components/Background3D.jsx`
- **Technology**: HTML5 Canvas with 2D context for high performance
- **Performance**: Automatic quality adjustment based on device memory, CPU cores, and screen size

### How It Works
1. A grid of blue dots is rendered across the canvas
2. Clicking creates a ripple wave emanating from the click point
3. Waves travel outward with physics-based decay
4. Dots move and scale based on wave height, creating 3D perspective illusion
5. Multiple waves can overlap and combine

### Performance Tiers
1. **Full** (Desktop): 22px spacing, 3.5px dots, up to 8 simultaneous waves
2. **Reduced** (Tablet/Touch): 30px spacing, 3px dots, up to 4 waves
3. **Minimal** (Mobile/Low-end): 40px spacing, 2.5px dots, up to 2 waves
