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

## Interactive 3D Wave Animation

Inspired by Google Antigravity's premium aesthetic.

### Features
- **Invisible by default**: Clean background until user clicks
- **3D parallax effect**: Dots lift up AND shift away from click point
- **Dynamic shadows**: Shadows appear below lifted dots for depth
- **Smooth physics**: Easing-based transitions for fluid motion
- **Multi-wave support**: Multiple overlapping waves from rapid clicks
- **Device-adaptive**: Three performance tiers for all devices

### Technical Implementation
- **Location**: `frontend/src/components/Background3D.jsx`
- **Technology**: HTML5 Canvas 2D (vanilla JS, no heavy dependencies)
- **Pattern**: React forwardRef for parent-child communication

### How It Works
1. Click triggers `triggerWave(x, y)` from Hero component
2. Wave expands from click point at constant speed
3. Dots within wave radius calculate:
   - **Energy**: Sine wave shape for smooth rise/fall
   - **Lift**: Vertical displacement (3D height)
   - **Parallax shift**: Horizontal/vertical displacement away from origin
   - **Scale**: Size increase at wave peak
4. Smooth easing applied to all transitions (0.15 factor)
5. Decay applied when no waves affecting dot (0.93 factor)
6. Shadow rendered at base position for depth illusion

### Key Functions
- `triggerWave(x, y)`: Creates new wave at coordinates
- `animate()`: Main render loop, processes waves and dots
- Wave shape: `Math.sin(position * Math.PI)` for smooth bell curve

### Performance Tiers
| Tier | Spacing | Dot Size | Max Waves | Target Device |
|------|---------|----------|-----------|---------------|
| Full | 8px | 1.2px | 10 | Desktop |
| Reduced | 14px | 1.3px | 6 | Tablet/Touch |
| Minimal | 20px | 1.4px | 4 | Mobile/Low-end |

### Animation Parameters
- Wave speed: 5px/frame
- Wave width: 180px (transition zone)
- Lift height: 20px max
- Parallax strength: 12px max shift
- Trail decay: 0.93 (smooth fade)
