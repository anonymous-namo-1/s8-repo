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
- Premium design overhaul across all pages (January 2026)
- Payment success pages redesigned with YouTube tutorial section (January 2026)

## Premium Design System

### Glassmorphism Effects
- **Header**: Enhanced blur effect with `glass-header-premium` class (30px blur, 88% opacity when scrolled)
- **Mobile Menu**: Frosted glass styling with `glass-menu` class (32px blur)
- **Cards**: `glass-card` utility for translucent card backgrounds

### CSS Utilities (index.css)
| Class | Effect |
|-------|--------|
| `.glass-card` | Glassmorphism cards with blur and subtle border |
| `.premium-hover-lift` | Lift 8px on hover with premium shadow |
| `.frosted-glass` | Strong blur variant (40px) |
| `.text-gradient` | Gradient text effects |
| `.premium-glow` | Subtle glow effects |
| `.scroll-reveal` | Smooth scroll-triggered reveal animation |
| `.premium-shadow-sm/md/lg` | Consistent shadow utilities |

### Component Enhancements
- **Header**: Logo scale animation, refined navigation underlines, pill-style badges
- **TemplateCard**: 3D tilt effect, glass overlay on hover, shimmer effect, gradient borders
- **Footer**: Glassmorphism background, hover-lift FAQ cards, animated link underlines
- **Buttons**: Premium variants with gradients and shine effects

### Payment Success Pages
- Card-based layout with rounded corners
- Animated success checkmark with gradient
- "Basics You Must Know" section with embedded YouTube tutorial (video ID: dhhVxJ_qUPc)
- URLs: `/order/success/x7k9m2p4q8r1t5v3w6y0z-a3b7c1d9e5f2g8h4j6` and `/order/success/w4h8a2t5s9p3p7m1n6b0k-q2r8e7y4u1i3o5p9a6s`

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
