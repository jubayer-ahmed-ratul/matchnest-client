# MatchNest — Frontend

React frontend for the MatchNest matrimony platform.

## Tech Stack

- React 18 + Vite
- Tailwind CSS + DaisyUI
- React Router v6
- Axios
- Firebase (Google OAuth)
- Recharts (Admin charts)
- @dnd-kit (Drag & drop)
- Stripe.js

## Getting Started

### 1. Clone & Install

```bash
cd frontend
npm install
```

### 2. Environment Variables

Create a `.env` file in the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_IMGBB_API_KEY=your_imgbb_api_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_AUTH_DOMAIN_CUSTOM=localhost
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Run

```bash
npm run dev
```

App runs on `http://localhost:5173`

## Features

**Authentication**
- Email/password + Google OAuth login & register
- JWT-based session management

**User Dashboard**
- Profile setup with 15+ fields, photo upload, identity verification
- Profile completion tracker (70% required to access matches)
- Smart suggestions based on religion, education, lifestyle, age & location (80% match threshold)
- Manual profile search with filters
- Send/receive/accept/reject interests
- Messenger-style chat (request → accept → chat)
- Submit success stories

**Matches Await**
- Opposite gender auto-filter
- Filter by age, religion, city, verified status
- Plan-based profile visibility (Free cannot see Premium/Elite)

**Membership Plans**
- Free / Premium / Elite via Stripe
- Plan-based feature access
- Receipt download after payment

**Admin Panel**
- Overview with charts (monthly registrations, plan distribution)
- User management (verify, activate/deactivate)
- Pending verification review with ID document viewer
- Success story moderation + drag & drop reorder
- Contact message inbox
- Payment list with receipt download

## Build for Production

```bash
npm run build
```

Deploy the `dist` folder to Netlify or any static host.
