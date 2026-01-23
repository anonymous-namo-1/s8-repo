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
- Simplified hero section text (January 2026)
- Implemented click-triggered wave animation (January 2026)

## Click-Triggered Wave Animation

### Features
- **Invisible by default**: No dots visible until user clicks
- **Click to activate**: Clicking anywhere creates an expanding wave of blue dots
- **Disappearing trail**: Dots only appear at the wavefront, then fade away after passing
- **Full-width coverage**: Works across the entire hero section (both sides)
- **Multiple waves**: Can trigger multiple overlapping waves
- **Device-friendly**: Three performance tiers adapt to device capabilities

### Technical Implementation
- **Location**: `frontend/src/components/Background3D.jsx`
- **Technology**: HTML5 Canvas with 2D context for high performance
- **Containment**: Hero section only

### How It Works
1. Background is clean with no dots visible initially
2. Clicking anywhere creates a wave that expands from that click point
3. Only dots at the current wavefront are visible (ring effect)
4. As the wave travels outward, dots behind it disappear
5. Multiple clicks create multiple overlapping wave rings
6. Waves auto-remove after reaching maximum radius

### Performance Tiers
1. **Full** (Desktop): 18px spacing, 4.5px dots, up to 8 simultaneous waves
2. **Reduced** (Tablet/Touch): 25px spacing, 4px dots, up to 4 waves
3. **Minimal** (Mobile/Low-end): 35px spacing, 3.5px dots, up to 3 waves
