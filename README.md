# ✦ Calci — Cinematic Premium Calculator

A production-grade, cinematic calculator web application built with an obsessive attention to design, animation, and precision. Inspired by the aesthetics of **Linear.app**, **Stripe**, and **Apple**.

> **Live Preview:** Run locally with `npm run dev:web` → `http://localhost:3000`

---

## 📑 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Design System](#design-system)
- [Frontend Deep Dive](#frontend-deep-dive)
  - [Pages & Routes](#pages--routes)
  - [Components](#components)
  - [State Management](#state-management)
  - [Calculator Logic](#calculator-logic)
  - [Animations](#animations)
  - [Three.js Particle System](#threejs-particle-system)
- [Backend Deep Dive](#backend-deep-dive)
  - [API Endpoints](#api-endpoints)
  - [Middleware Stack](#middleware-stack)
  - [Database Models](#database-models)
- [Key Concepts & Patterns](#key-concepts--patterns)
- [Environment Variables](#environment-variables)
- [Scripts Reference](#scripts-reference)
- [Learning Resources](#learning-resources)

---

## Overview

This project is a **full-stack monorepo** containing:

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 (App Router) | SSR/SSG React framework |
| **Styling** | Tailwind CSS v4 + CSS Custom Properties | Utility-first + design tokens |
| **Animations** | Framer Motion + GSAP + Lenis | Spring physics, scroll reveals, smooth scroll |
| **3D Graphics** | Three.js via React Three Fiber | Particle field background |
| **Math Engine** | math.js | Precision arithmetic (no floating point errors) |
| **State** | Zustand (persisted) | Client-side calculator state |
| **Data Fetching** | React Query (TanStack Query) | Server state, caching, optimistic updates |
| **Backend** | Express.js + TypeScript | REST API server |
| **Database** | MongoDB + Mongoose | Calculation history persistence |
| **Auth** | JWT (JSON Web Tokens) | Guest authentication |
| **Validation** | Zod | Schema validation on all inputs |
| **Security** | Helmet + Rate Limiting | HTTP headers + DDoS protection |
| **Logging** | Winston | Structured JSON logging |

---

## Tech Stack

### Frontend
```
Next.js 14          → React framework with App Router (file-based routing)
TypeScript          → Static typing for safety and DX
Tailwind CSS v4     → Utility-first CSS framework
Framer Motion       → Declarative React animations (spring physics)
GSAP 3              → Timeline-based animation (ScrollTrigger, text reveals)
Three.js / R3F      → WebGL 3D particle field
Lenis               → Smooth scroll library
Zustand             → Lightweight state management
React Query         → Server state management
Axios               → HTTP client
math.js             → Arbitrary precision arithmetic
```

### Backend
```
Express.js          → HTTP server framework
MongoDB / Mongoose  → NoSQL database + ODM
JWT                 → Stateless authentication
Zod                 → Runtime schema validation
Winston             → Structured logging
Helmet              → Security HTTP headers
express-rate-limit  → API rate limiting
```

---

## Project Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Browser (Client)                     │
├─────────────────────────────────────────────────────────┤
│  Next.js App Router                                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Landing   │  │  Calculator  │  │   Three.js       │  │
│  │ Page      │  │  Page        │  │   Canvas (R3F)   │  │
│  └─────┬────┘  └──────┬───────┘  └──────────────────┘  │
│        │               │                                 │
│  ┌─────┴───────────────┴─────────────────────────┐      │
│  │              Zustand Store (persisted)          │      │
│  │  display, expression, history, settings, theme │      │
│  └────────────────────────┬──────────────────────┘      │
│                           │                              │
│  ┌────────────────────────┴──────────────────────┐      │
│  │         useCalculator Hook (ALL logic)          │      │
│  │  math.js evaluation, keyboard, memory, etc.    │      │
│  └────────────────────────┬──────────────────────┘      │
│                           │                              │
│  ┌────────────────────────┴──────────────────────┐      │
│  │       API Client (Axios + JWT interceptor)      │      │
│  └────────────────────────┬──────────────────────┘      │
├───────────────────────────┼─────────────────────────────┤
│                    HTTP (REST API)                        │
├───────────────────────────┼─────────────────────────────┤
│  ┌────────────────────────┴──────────────────────┐      │
│  │            Express.js API Server               │      │
│  │                                                │      │
│  │  Middleware Stack:                              │      │
│  │  Helmet → CORS → Rate Limit → Auth → Validate  │      │
│  │                                                │      │
│  │  Routes:                                        │      │
│  │  POST /api/v1/calculate                         │      │
│  │  GET  /api/v1/history      (JWT required)       │      │
│  │  POST /api/v1/auth/guest                        │      │
│  └────────────────────────┬──────────────────────┘      │
│                           │                              │
│  ┌────────────────────────┴──────────────────────┐      │
│  │              MongoDB (Mongoose)                 │      │
│  │  Collections: calculations, users               │      │
│  └───────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

---

## Folder Structure

```
calc-app/
├── package.json                    # Monorepo root (npm workspaces)
├── tsconfig.base.json              # Shared TypeScript config
├── .gitignore
│
├── apps/
│   ├── web/                        # ── Next.js Frontend ──
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout (fonts, metadata, Providers)
│   │   │   ├── page.tsx            # Landing page (/)
│   │   │   ├── globals.css         # Global styles + Tailwind + token imports
│   │   │   └── calculator/
│   │   │       └── page.tsx        # Calculator page (/calculator)
│   │   │
│   │   ├── components/
│   │   │   ├── Providers.tsx       # React Query + Auth provider
│   │   │   ├── ui/                 # ── Design Primitives ──
│   │   │   │   ├── Button.tsx      # Glass button with spring press + magnetic hover
│   │   │   │   └── Card.tsx        # Glass card with variants (glass/solid/outline/glow)
│   │   │   │
│   │   │   ├── calculator/         # ── Calculator Components ──
│   │   │   │   ├── CalcDisplay.tsx  # Display with animated digits (AnimatePresence)
│   │   │   │   ├── CalcKeypad.tsx   # Button grid (standard + scientific layouts)
│   │   │   │   ├── CalcHistory.tsx  # Slide-in history drawer
│   │   │   │   └── CalculatorPage.tsx # Main calculator page (assembles everything)
│   │   │   │
│   │   │   ├── landing/            # ── Landing Page Sections ──
│   │   │   │   ├── Hero.tsx        # Hero with particles + GSAP text reveal
│   │   │   │   ├── Features.tsx    # Feature cards with ScrollTrigger
│   │   │   │   └── CalculatorPreview.tsx # 3D-tilted preview card
│   │   │   │
│   │   │   └── three/              # ── WebGL ──
│   │   │       └── ParticleField.tsx # R3F particle system (2000 points)
│   │   │
│   │   ├── lib/
│   │   │   ├── animations/         # ── Animation Utilities ──
│   │   │   │   ├── framer.ts       # Framer Motion variants (page, digit, button, etc.)
│   │   │   │   └── gsap.ts         # GSAP utilities (SplitText, ScrollTrigger, parallax)
│   │   │   │
│   │   │   ├── hooks/              # ── Custom Hooks ──
│   │   │   │   ├── useCalculator.ts # ALL calculator logic (zero logic in UI)
│   │   │   │   ├── useMagnetic.ts   # Magnetic cursor effect hook
│   │   │   │   └── useHistory.ts    # React Query hooks for API calls
│   │   │   │
│   │   │   ├── store/              # ── State Management ──
│   │   │   │   └── calculatorStore.ts # Zustand store (persisted to localStorage)
│   │   │   │
│   │   │   ├── api/                # ── API Client ──
│   │   │   │   └── client.ts       # Typed Axios client with JWT interceptor
│   │   │   │
│   │   │   └── utils/              # ── Utilities ──
│   │   │       ├── math.ts         # math.js wrapper (safeEvaluate, formatDisplay)
│   │   │       └── sound.ts        # Web Audio API sound synthesis
│   │   │
│   │   └── styles/
│   │       └── tokens.css          # CSS custom properties (colors, spacing, motion)
│   │
│   └── api/                        # ── Express Backend ──
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env                    # Environment variables
│       └── src/
│           ├── server.ts           # Express app entry point
│           ├── config/
│           │   ├── db.ts           # MongoDB connection with retry
│           │   ├── env.ts          # Zod-validated environment config
│           │   └── logger.ts       # Winston structured logger
│           ├── controllers/
│           │   ├── calculationController.ts  # POST /calculate, GET/DELETE /history
│           │   └── authController.ts         # POST /auth/guest
│           ├── middleware/
│           │   ├── auth.ts         # JWT verification
│           │   ├── rateLimit.ts    # 100 req/15min per IP
│           │   ├── validate.ts     # Zod schema validation
│           │   └── errorHandler.ts # 4-layer error handler
│           ├── models/
│           │   ├── Calculation.model.ts  # Mongoose schema for calculations
│           │   └── User.model.ts         # Mongoose schema for guest users
│           ├── services/
│           │   ├── calculationService.ts  # math.js expression evaluation
│           │   └── historyService.ts      # CRUD for calculation history
│           └── routes/
│               └── index.ts        # Route registration
│
└── packages/
    └── shared/                     # ── Shared Types ──
        ├── package.json
        └── types.ts                # TypeScript interfaces used by both apps
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB** (optional — app works offline without it)

### Installation

```bash
# Clone the repo
git clone https://github.com/Joylan9/Calculator-Nishant.git
cd Calculator-Nishant

# Install all dependencies (root + workspaces)
npm install
```

### Running the Project

```bash
# Frontend only (recommended for study)
npm run dev:web
# → Open http://localhost:3000

# Backend only (requires MongoDB)
npm run dev:api
# → API at http://localhost:4000

# Both simultaneously
npm run dev
```

### Building for Production

```bash
npm run build
# Creates optimized Next.js build in apps/web/.next/
```

---

## Design System

The entire UI is built on a **token-based design system** defined in `styles/tokens.css`.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | `#0A0A0F` | Main background (near-black) |
| `--color-bg-secondary` | `#0F0F17` | Elevated surfaces |
| `--color-bg-tertiary` | `#14141F` | Cards, inputs |
| `--color-gold` | `#C9A84C` | Primary accent (operators, CTAs) |
| `--color-teal` | `#2BFFD8` | Secondary accent (actions, highlights) |
| `--color-text-primary` | `#FAFAF9` | Main text |
| `--color-text-secondary` | `#A8A8B3` | Subdued text |
| `--color-text-muted` | `#5A5A6E` | Disabled/hint text |

### Typography

| Font | Usage | Import |
|------|-------|--------|
| **Cormorant Garamond** | Display headings (hero, section titles) | Google Fonts |
| **DM Mono** | Numbers, code, calculator display | Google Fonts |
| **Outfit** | Body text, UI labels, buttons | Google Fonts |

### Motion Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | `150ms` | Hover states, micro-interactions |
| `--duration-base` | `300ms` | Standard transitions |
| `--duration-slow` | `600ms` | Page transitions, reveals |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Primary easing (feels snappy) |

### Glassmorphism

```css
background: rgba(255, 255, 255, 0.05);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.08);
```

### Three Themes

The app supports 3 color themes, switchable via CSS `data-theme` attribute:

1. **Obsidian** (default) — Deep dark with warm gold
2. **Midnight** — Blue-tinted dark with brighter gold
3. **Phantom** — Purple-tinted dark with vivid teal

---

## Frontend Deep Dive

### Pages & Routes

| Route | File | Description |
|-------|------|-------------|
| `/` | `app/page.tsx` | Landing/marketing page |
| `/calculator` | `app/calculator/page.tsx` | Calculator application |

Both are **client-side rendered** (`'use client'`) because they rely on browser APIs (animations, Three.js, keyboard events).

### Components

#### UI Primitives (`components/ui/`)

**`Button.tsx`** — A glassmorphism button with:
- **6 variants**: primary, secondary, ghost, gold, teal, danger
- **4 sizes**: sm, md, lg, xl
- **Framer Motion**: `whileTap={{ scale: 0.94 }}` with spring physics
- **Magnetic hover**: optional `useMagnetic` hook integration
- **Glow effect**: optional gold box-shadow

**`Card.tsx`** — A glass card with:
- **4 variants**: glass, solid, outline, glow
- **Hover animation**: lifts 4px with `whileHover`

#### Calculator Components (`components/calculator/`)

**`CalcDisplay.tsx`** — The result display area:
- Dynamic font sizing based on digit count
- `AnimatePresence` animates each character entering/exiting
- Shows expression line above result
- Grid background pattern overlay
- Precision mode badge indicator

**`CalcKeypad.tsx`** — The button grid:
- **Standard mode**: 5 rows × 4 columns (20 buttons)
- **Scientific mode**: 10 rows × 4 columns (40 buttons)
- Color-coded by type: numbers (white), operators (gold), functions (gray), actions (teal), equals (gold glow)
- Each button has spring press animation (`scale: 0.94`)

**`CalcHistory.tsx`** — Slide-in drawer:
- Opens from right side with `slideInRight` Framer variant
- Backdrop overlay with blur
- Each entry shows expression, result, timestamp, mode
- Click entry to reuse its result
- "Clear All" button

**`CalculatorPage.tsx`** — Main page that assembles everything:
- Mode tabs with `layoutId` animation (Framer Motion shared layout)
- Toolbar: sound toggle, precision mode, copy result, history
- Theme switcher dots
- Background grid + ambient gold glow

#### Landing Components (`components/landing/`)

**`Hero.tsx`** — The hero section:
- **Three.js** particle background (lazy-loaded with `next/dynamic`)
- **GSAP SplitText**: each letter of "Calculate with Elegance" animated
- **Magnetic CTA button** using `useMagnetic` hook
- Stat badges (precision, fps, modes)
- Animated scroll indicator

**`Features.tsx`** — 6 feature cards:
- GSAP `ScrollTrigger` stagger reveal
- Accent-colored hover border

**`CalculatorPreview.tsx`** — 3D preview card:
- Mouse-following 3D tilt via Framer Motion `useMotionValue` + `useTransform`
- `perspective: 1200px` for depth effect
- Static mock calculator display

### State Management

**Zustand** (`lib/store/calculatorStore.ts`):

```typescript
interface CalculatorState {
  // Display state
  display: string;          // Current number shown
  expression: string;       // Pending expression (e.g., "5 + ")
  previousResult: string;   // Last calculated result
  isNewNumber: boolean;     // Next digit starts new number
  hasCalculated: boolean;   // Just pressed equals

  // Settings
  mode: 'standard' | 'scientific';
  theme: 'midnight' | 'obsidian' | 'phantom';
  soundEnabled: boolean;
  precisionMode: boolean;

  // History
  history: HistoryEntry[];  // Last 100 calculations
  historyOpen: boolean;

  // Memory
  memory: number;           // M+, M-, MR, MC
}
```

**Persistence**: Uses `zustand/middleware/persist` to save theme, sound, precision, history, and memory to `localStorage` under key `calc-app-store`.

### Calculator Logic

**ALL calculator logic lives in `useCalculator.ts`** — zero logic in UI components. This is a deliberate architectural decision for testability and separation of concerns.

Key functions:

| Function | What it does |
|----------|-------------|
| `inputDigit(d)` | Appends digit to display, handles new number state |
| `inputDecimal()` | Adds decimal point (prevents doubles) |
| `inputOperator(op)` | Sets pending operator, evaluates chain expressions |
| `calculate()` | Evaluates full expression via `safeEvaluate()` |
| `clear()` | Resets all state (AC) |
| `clearEntry()` | Clears current display only (CE) |
| `backspace()` | Removes last character |
| `toggleSign()` | Negates current number (±) |
| `percentage()` | Divides by 100 |
| `scientificFunction(fn)` | Evaluates sin/cos/tan/log/ln/sqrt/x²/x³/1/x/|x|/x! |
| `inputConstant(c)` | Inserts π or e |
| `inputParenthesis(p)` | Manages parentheses for grouped expressions |
| `handleMemory(action)` | MC, MR, M+, M- |

**Keyboard support**: A `useEffect` listens for `keydown` events and maps keys to actions (0-9, +, -, *, /, Enter, Escape, Backspace, %).

### Animations

#### Framer Motion (`lib/animations/framer.ts`)

| Variant | Usage |
|---------|-------|
| `pageVariants` | Page enter/exit (opacity + y) |
| `staggerContainer` | Stagger children with 0.08s delay |
| `fadeUpItem` | Fade in from below |
| `buttonPress` | Scale to 0.94 on tap (spring stiffness 400) |
| `slideInRight` | History drawer slide-in |
| `digitVariants` | Calculator digit enter/exit with blur |
| `tabContentVariants` | Tab switch content animation |
| `glowPulse` | Infinite gold glow pulse |

#### GSAP (`lib/animations/gsap.ts`)

| Function | Usage |
|----------|-------|
| `splitTextIntoSpans()` | Custom SplitText replacement (wraps each char in `<span>`) |
| `createHeroTimeline()` | Staggers character reveal + subtitle + CTA |
| `createScrollReveal()` | Fades element in when scrolled into view |
| `createParallax()` | Moves element at different speed on scroll |
| `createStaggerReveal()` | Staggers multiple child elements on scroll |

**All animations check `prefers-reduced-motion`** and skip if the user prefers reduced motion.

### Three.js Particle System

**`components/three/ParticleField.tsx`**

- Uses **React Three Fiber** (R3F) — React bindings for Three.js
- **2000 particles** as `THREE.Points` with `BufferGeometry`
- **Movement**: Each particle has random velocity, bounces off boundaries
- **Mouse parallax**: Rotation follows mouse position
- **Depth fog**: `<fog>` element fades distant particles
- **Additive blending**: Particles glow by adding light values
- **Performance**: `dpr={[1, 1.5]}`, `antialias: false`
- **Lazy loaded**: `next/dynamic` with `ssr: false` (WebGL is browser-only)

### Sound System

**`lib/utils/sound.ts`** — Synthesizes sounds using the **Web Audio API**:

| Sound | Frequency | Duration | Trigger |
|-------|-----------|----------|---------|
| `click()` | 800Hz | 60ms | Operators, functions |
| `keypress()` | 600Hz | 50ms | Digit input |
| `calculate()` | 1200Hz + 1500Hz | 100ms | Equals |
| `error()` | 200Hz | 150ms | Invalid expression |
| `clear()` | 400Hz | 80ms | Clear/reset |

Uses `OscillatorNode` + `GainNode` with exponential ramp for natural decay.

---

## Backend Deep Dive

### API Endpoints

#### `POST /api/v1/auth/guest`
Issues a guest JWT token (no registration required).

```json
// Response
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "expiresAt": "2024-01-25T00:00:00.000Z"
  }
}
```

#### `POST /api/v1/calculate`
Evaluates a math expression server-side using math.js.

```json
// Request
{ "expression": "sin(45) * 2 + 3", "mode": "scientific" }

// Response
{
  "success": true,
  "data": {
    "result": "4.414213562373095",
    "steps": [{ "expression": "sin(45) * 2 + 3", "result": "4.414213562373095", "operation": "evaluate" }],
    "timestamp": "2024-01-18T12:00:00.000Z"
  }
}
```

#### `GET /api/v1/history` (JWT Required)
Returns paginated calculation history.

```
GET /api/v1/history?limit=20&offset=0
Authorization: Bearer <token>
```

#### `DELETE /api/v1/history` (JWT Required)
Clears all calculation history for the authenticated user.

### Middleware Stack

Requests flow through this pipeline:

```
Request → Helmet → CORS → Rate Limit → Route Handler
                                            ↓
                                    Auth (if required)
                                            ↓
                                    Zod Validation
                                            ↓
                                      Controller
                                            ↓
                                       Service
                                            ↓
                                    Error Handler (4 layers)
```

**4-Layer Error Handler:**

1. **Validation errors** (Zod/Mongoose) → 400
2. **Auth errors** (JWT invalid/expired) → 401
3. **Application errors** (known, with statusCode) → custom status
4. **System errors** (unexpected) → 500 + Winston log

### Database Models

**Calculation** (`models/Calculation.model.ts`):
```typescript
{
  expression: string;    // "sin(45) * 2 + 3"
  result: string;        // "4.414213562373095"
  steps: [{              // Evaluation steps
    expression: string;
    result: string;
    operation: string;
  }];
  userId: string;        // Guest JWT user ID
  mode: 'standard' | 'scientific';
  createdAt: Date;       // Auto-generated
}
// Indexes: { userId: 1, createdAt: -1 }
```

**User** (`models/User.model.ts`):
```typescript
{
  guestId: string;       // UUID v4 (unique)
  createdAt: Date;
}
```

---

## Key Concepts & Patterns

### 1. Separation of Concerns
All calculator logic lives in `useCalculator` hook — UI components are purely presentational. This makes the logic testable independently of React.

### 2. Offline-First Architecture
The app works fully offline via Zustand (persisted to localStorage). The backend is optional — only needed for server-side history persistence.

### 3. Token-Based Design System
All visual values (colors, spacing, shadows, motion timing) are CSS custom properties. Themes work by overriding these tokens with `[data-theme]` selectors.

### 4. Animation Accessibility
Every animation checks `prefers-reduced-motion` and skips if enabled. This is a WCAG 2.1 AA requirement.

### 5. Lazy Loading
Three.js canvas is loaded with `next/dynamic` + `ssr: false` because WebGL requires a browser. This reduces initial bundle size significantly (~170KB saved on first load).

### 6. Typed API Layer
All API calls go through `lib/api/client.ts` — never `fetch()` directly in components. This centralizes error handling, JWT attachment, and response normalization.

### 7. Precision Arithmetic
Calculator uses `math.js` instead of native JavaScript floats. This means `0.1 + 0.2 = 0.3` (not `0.30000000000000004`).

### 8. Spring Physics
Button press animations use spring physics (`stiffness: 400, damping: 17`) instead of duration-based easing. This feels more natural and responsive.

---

## Environment Variables

### Backend (`apps/api/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | API server port |
| `MONGODB_URI` | `mongodb://localhost:27017/calc-app` | MongoDB connection string |
| `JWT_SECRET` | `calc-app-secret-key-...` | JWT signing secret |
| `JWT_EXPIRES_IN` | `7d` | Token expiration |
| `NODE_ENV` | `development` | Environment mode |
| `CORS_ORIGIN` | `http://localhost:3000` | Allowed CORS origin |

### Frontend (`apps/web/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api/v1` | Backend API URL |

---

## Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Run frontend + backend concurrently |
| `npm run dev:web` | Run Next.js dev server only |
| `npm run dev:api` | Run Express API only |
| `npm run build` | Build Next.js for production |
| `npm run lint` | Lint frontend code |

---

## Learning Resources

### Technologies Used

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [GSAP ScrollTrigger](https://greensock.com/scrolltrigger/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Zustand](https://docs.pmnd.rs/zustand)
- [TanStack React Query](https://tanstack.com/query)
- [math.js](https://mathjs.org/docs/)
- [Mongoose](https://mongoosejs.com/docs/)
- [Zod](https://zod.dev/)
- [Winston Logger](https://github.com/winstonjs/winston)

### Design Patterns

- [Separation of Concerns in React](https://react.dev/learn/thinking-in-react)
- [Custom Hooks](https://react.dev/learn/reusing-logic-with-custom-hooks)
- [CSS Custom Properties (Design Tokens)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Glassmorphism Design](https://hype4.academy/tools/glassmorphism-generator)
- [Spring Animations](https://www.joshwcomeau.com/animation/a-friendly-introduction-to-spring-physics/)

---

## License

This project is for educational purposes.

---

<p align="center">
  <sub>Built with ✦ precision — Next.js · Three.js · Framer Motion · math.js</sub>
</p>
