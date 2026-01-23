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
- **Interactive Blue Dot Grid**: A responsive grid of blue dots on the right side of the hero section
- **Click-Triggered Ripple Waves**: Clicking anywhere in the hero creates a wave that spreads outward
- **3D Illusion**: Dots scale and shift position to create depth and 3D wave effect
- **Ambient Animation**: Continuous subtle wave movement even without interaction
- **Content-Aware Positioning**: Dots fade out on the left side to keep text/buttons clear
- **Section Containment**: Dots fade at the bottom to prevent bleeding into section 2
- **Device Optimization**: Three performance tiers based on device capabilities

### Technical Implementation
- **Location**: `frontend/src/components/Background3D.jsx` (integrated into Hero.jsx)
- **Technology**: HTML5 Canvas with 2D context for high performance
- **Containment**: Hero section only (not page-wide)
- **Fade Zones**: Left side (45% clearance for content) and bottom (55-90% for section transition)

### How It Works
1. Blue dots are rendered in a grid pattern on the right side of the hero section
2. Clicking anywhere creates a ripple wave emanating from that point
3. Waves travel outward with physics-based decay
4. Dots move and scale based on wave height, creating 3D perspective illusion
5. Horizontal fade keeps the content area (left side) clear
6. Vertical fade prevents dots from bleeding into the next section

### Performance Tiers
1. **Full** (Desktop): 22px spacing, 3.5px dots, up to 8 simultaneous waves
2. **Reduced** (Tablet/Touch): 30px spacing, 3px dots, up to 4 waves
3. **Minimal** (Mobile/Low-end): 40px spacing, 2.5px dots, up to 2 waves
