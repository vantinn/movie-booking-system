# VT Cinema — Movie Booking System

A full-stack online movie ticket booking platform for **VT Cinema** — a cinema chain operating across Đà Nẵng & Quảng Nam, Vietnam. Users can browse movies, select showtimes, pick seats, and pay securely. Admins can manage the entire catalogue via a dedicated API layer.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features](#features)
- [Data Model](#data-model)
- [API Reference](#api-reference)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation & Running](#installation--running)
  - [Database Seeding](#database-seeding)
- [Testing](#testing)
- [Contributing](#contributing)

---

## Overview

| Item | Detail |
|---|---|
| **Architecture** | Monorepo — `apps/frontend` + `apps/backend` |
| **Frontend** | Next.js 15 (App Router) · React 19 · TypeScript |
| **Backend** | Express.js 5 · TypeORM · PostgreSQL · TypeScript |
| **Payment** | Stripe Payment Intent API + Webhook |
| **Auth** | JWT (Access + Refresh tokens) · OTP email verification |
| **Brand** | VT Cinema — 6 locations in Đà Nẵng & Quảng Nam |

---

## Tech Stack

### Frontend (`apps/frontend`)

| Category | Library / Tool |
|---|---|
| Framework | Next.js 15 (Turbopack) |
| UI | React 19, Tailwind CSS v4, Radix UI, shadcn/ui |
| State Management | Redux Toolkit + RTK Query |
| Payment | @stripe/react-stripe-js · @stripe/stripe-js |
| Animation | GSAP 3 |
| Date Utilities | date-fns |
| Testing | Cypress 15 (E2E) · Vitest (Unit) |
| Linting | ESLint 9 |

### Backend (`apps/backend`)

| Category | Library / Tool |
|---|---|
| Framework | Express.js 5 |
| ORM | TypeORM 0.3 |
| Database | PostgreSQL (via `pg`) |
| Auth | jsonwebtoken · bcrypt |
| Validation | class-validator · class-transformer · express-validator |
| Payment | Stripe SDK |
| Email / OTP | Nodemailer (Gmail App Password) |
| Scheduler | node-cron |
| Storage | Supabase JS SDK |
| API Docs | tsoa · swagger-ui-express |
| Dev Tools | ts-node-dev · TypeScript 5 |

---

## Project Structure

```
movie-booking-system/
├── apps/
│   ├── backend/
│   │   └── src/
│   │       ├── config/          # DB connection, env config
│   │       ├── controllers/
│   │       │   ├── admin/       # Admin CRUD controllers
│   │       │   ├── public/      # Public (unauthenticated) controllers
│   │       │   └── user/        # Authenticated user controllers
│   │       ├── dtos/            # Data Transfer Objects (class-validator)
│   │       ├── entities/        # TypeORM entities
│   │       ├── enums/           # Status, Role, Seat type enums
│   │       ├── middleware/      # Auth guard, error handler, validator
│   │       ├── routes/          # Route definitions (admin / user / public)
│   │       ├── seeds/           # Database seed scripts
│   │       ├── services/        # Business logic layer
│   │       ├── types/           # Shared TypeScript types
│   │       └── utils/           # JWT, Stripe client, booking cron, errors
│   │
│   └── frontend/
│       └── src/
│           ├── app/             # Next.js App Router pages
│           │   ├── (auth)/      # Login, Register pages
│           │   ├── (main)/      # Booking, Payment, Account pages
│           │   └── (public)/    # Home, Movies, Cinemas pages
│           ├── components/      # Shared layout components (Header, Footer)
│           ├── features/        # Feature-sliced modules
│           │   ├── auth/        # Login / Register forms + RTK slice
│           │   ├── movies/      # Movie list, detail, banner slider
│           │   ├── cinemas/     # Cinema listings
│           │   ├── booking/     # Seat grid, booking summary
│           │   ├── payment/     # Stripe checkout, cancel, success
│           │   └── account/     # Profile, history, password
│           ├── lib/             # Redux store setup
│           ├── providers/       # ReduxProvider
│           └── utils/           # datetime, slugify helpers
└── .gitignore
```

---

## Features

### Authentication
- **OTP Email Verification** — 6-digit OTP sent via Gmail before registration; rate-limited to 3 sends/email/hour
- **Register / Login / Logout** — bcrypt password hashing (cost factor 12)
- **JWT Strategy** — short-lived Access Token + long-lived Refresh Token (stored in HTTP-only cookies)
- **Role-Based Access Control** — `USER` and `ADMIN` roles enforced via middleware

### Movies & Cinemas
- Auto-advancing hero banner slider with blurred background and thumbnail strip
- Movie cards with rating, duration, genre badges, and age-rating labels
- Movie detail page with trailer link and available showtimes per cinema

### Seat Booking
- Interactive seat grid — three seat types: **Sida** (standard), **Couple**, **VIP**
- Real-time seat status: `available → HELD → CONFIRMED / RELEASED`
- Booking summary panel showing movie, cinema, showtime, selected seats, and total

### Payment
- **Stripe Payment Intent** — card payments via `CheckoutFormInner` embedded form
- **Stripe Webhook** — `payment_intent.succeeded` confirms the booking and locks seats
- **MoMo** — referenced in payment enums (`PaymentBank.MOMO`) for future integration
- **Auto-cancel cron** — every 1 minute, bookings pending for > 3 minutes are auto-cancelled and seats released

### Admin Panel (API)
Full CRUD over: Movies · Cinemas · Rooms · Seats · Showtimes · Bookings · BookingSeats · Users

### Account Management
- View and edit profile (name, phone, address, avatar, date of birth)
- Change password
- Full booking history
- Member card

---

## Data Model

```
User ─────────────── Booking ─────────── BookingSeat
  │                     │                     │
  └── Payment           └── ShowTime          └── Seat
                               │                    │
                            Movie               Room
                                                  │
                                              Cinema
```

| Entity | Key Fields |
|---|---|
| `User` | id, email, full_name, role (USER/ADMIN), gender, dateOfBirth, avatar_url |
| `Movies` | id, title, image, trailer, release_date, rating, duration, genres, description |
| `Cinema` | id, name, address, regions, distance, facilities, image |
| `Room` | id, cinema_id, name |
| `Seat` | id, room_id, name, price, role (Sida/Couple/Vip), row, number, status |
| `ShowTime` | id, movie_id, room_id, start_time, end_time |
| `Booking` | id, user_id, showtimeid, status (PENDING/SUCCESS/FAILED/CANCELLED), totalPrice, expiresAt |
| `BookingSeat` | id, booking_id, seat_id, showtime_id, price, statusSeat (HELD/CONFIRMED/RELEASED) |
| `Payment` | id, booking_id, user_id, provider (STRIPE/MOMO), amount, currency, statusPayment |

---

## API Reference

All routes are prefixed with `/api`.

### Public — `/api/public` (no auth required)

| Method | Path | Description |
|---|---|---|
| `POST` | `/auth/send-otp` | Send 6-digit OTP to email |
| `POST` | `/auth/verify-otp` | Verify OTP |
| `POST` | `/auth/register` | Register new user (requires verified OTP) |
| `POST` | `/auth/login` | Login, returns JWT pair |
| `POST` | `/auth/logout` | Clear refresh token cookie |
| `POST` | `/auth/refresh` | Issue new access token |
| `GET` | `/movies` | List all movies |
| `GET` | `/movies/:id` | Movie detail |
| `GET` | `/cinemas` | List all cinemas |
| `GET` | `/showtimes` | List showtimes |
| `GET` | `/rooms` | List rooms |
| `GET` | `/seats` | List seats |

### User — `/api/user` (Bearer token required)

| Method | Path | Description |
|---|---|---|
| `GET` | `/user/me` | Get own profile |
| `PUT` | `/user/me` | Update profile |
| `GET` | `/booking` | List own bookings |
| `POST` | `/booking` | Create booking |
| `GET` | `/booking-seat` | List booking seats |
| `POST` | `/booking-seat` | Hold seats |
| `POST` | `/booking-final` | Finalise booking |
| `POST` | `/paymentInt` | Create Stripe Payment Intent |
| `POST` | `/paymentInt/webhook` | Stripe webhook (raw body) |

### Admin — `/api/admin` (Bearer token + ADMIN role required)

Full CRUD for: `movies`, `cinemas`, `rooms`, `seats`, `showtimes`, `bookings`, `booking-seats`, `users`

---

## Getting Started

### Prerequisites

- Node.js ≥ 20
- PostgreSQL ≥ 15
- A [Stripe](https://stripe.com) account (test mode)
- A Gmail account with an **App Password** enabled

---

### Environment Variables

#### Backend — `apps/backend/.env`

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=movie_booking

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_SUCCESS_URL=http://localhost:3001/payment/success
STRIPE_CANCEL_URL=http://localhost:3001/payment/cancel

# Frontend origin (CORS)
FRONTEND_URL=http://localhost:3001

# Email (OTP)
GMAIL_USER=your_gmail@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# Server
PORT=3000
```

#### Frontend — `apps/frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

> **Note:** Copy `.env.example` (if provided) to `.env` and fill in the values. Never commit `.env` files.

---

### Installation & Running

**1. Clone the repository**

```bash
git clone <repo-url>
cd movie-booking-system
```

**2. Install dependencies**

```bash
# Backend
cd apps/backend
npm install

# Frontend
cd ../frontend
npm install
```

**3. Start the backend**

```bash
cd apps/backend
npm run dev          # ts-node-dev with hot reload
# Server starts on http://localhost:3000
```

**4. Start the frontend**

```bash
cd apps/frontend
npm run dev          # Next.js with Turbopack
# App starts on http://localhost:3001
```

**5. (Optional) Stripe webhook forwarding** — required for local payment testing

```bash
stripe listen --forward-to http://localhost:3000/api/user/paymentInt/webhook
```

---

### Database Seeding

Seed 6 VT Cinema locations across Đà Nẵng & Quảng Nam:

```bash
cd apps/backend
npx ts-node -r tsconfig-paths/register src/seeds/danang-cinemas.seed.ts
```

The seed script is idempotent — it skips cinemas that already exist.

---

## Testing

### Frontend — E2E with Cypress

```bash
cd apps/frontend

# Open Cypress interactive runner
npm run cypress:open

# Run headless
npm run cypress:run

# Component testing
npm run cy:open-ct
```

### Frontend — Unit tests with Vitest

```bash
cd apps/frontend
npx vitest
```

---

## Contributing

1. Create a feature branch from `develop`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Follow the existing folder structure — controllers → services → routes.
3. Add DTOs with `class-validator` decorators for all new request bodies.
4. Open a Pull Request targeting `develop`. Tag at least one reviewer.

---

> **VT Cinema** — *Đặt vé nhanh, trải nghiệm chuẩn.*
