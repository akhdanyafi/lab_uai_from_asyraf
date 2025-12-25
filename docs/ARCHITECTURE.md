# Architecture Overview

This document provides a high-level overview of the LAB_UAI technical architecture.

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: MySQL
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with [Lucide React](https://lucide.dev/) icons
- **Validation**: [Zod](https://zod.dev/) for input validation

## Architecture Pattern

This project uses a **Feature-Based Architecture** where code is organized by domain/feature rather than technical layer.

## Folder Structure

```
LAB_UAI/
├── app/                        # Next.js App Router (Pages)
│   ├── (home)/                 # Homepage route group
│   │   ├── _components/        # Colocated homepage components
│   │   └── page.tsx            # Homepage (URL: /)
│   │
│   ├── (auth)/                 # Auth route group
│   │   ├── login/              # Login page
│   │   └── register/           # Register page
│   │
│   ├── admin/                  # Admin routes
│   │   ├── hero-photos/_components/
│   │   ├── inventory/_components/
│   │   ├── validations/_components/
│   │   └── practicum/[id]/_components/
│   │
│   ├── student/                # Student routes
│   └── lecturer/               # Lecturer routes
│
├── features/                   # Feature-based modules ⭐
│   ├── academic/               # Academic & Practicum feature
│   │   ├── actions.ts          # Server actions
│   │   ├── practicum.ts        # Practicum-specific actions
│   │   ├── types.ts            # TypeScript types
│   │   └── components/         # Feature components
│   │
│   ├── auth/                   # Authentication feature
│   │   └── actions.ts
│   │
│   ├── bookings/               # Room booking feature
│   │   ├── actions.ts
│   │   ├── service.ts
│   │   ├── validator.ts
│   │   ├── types.ts
│   │   └── components/
│   │
│   ├── dashboard/              # Dashboard feature
│   ├── governance/             # SOP, LPJ, User management
│   ├── hero-photos/            # Hero carousel feature
│   ├── inventory/              # Item inventory feature
│   ├── loans/                  # Item loan feature
│   ├── publications/           # Publications feature
│   └── users/                  # User management feature
│
├── components/                 # Shared components only
│   ├── ui/                     # Generic UI primitives
│   ├── layout/                 # Layout (Sidebar, Navbar, Footer)
│   └── shared/                 # Cross-feature shared (CalendarView)
│
├── lib/                        # Shared utilities
│   ├── auth.ts                 # Auth utilities
│   ├── upload.ts               # File upload utilities
│   └── utils.ts                # General utilities
│
├── db/                         # Database layer
│   ├── index.ts                # Database connection
│   ├── schema.ts               # Drizzle schema exports
│   ├── schema/                 # Table definitions
│   └── seeds/                  # Database seeds
│
├── docs/                       # Project documentation
│   ├── ARCHITECTURE.md
│   ├── CONTRIBUTING.md
│   ├── FEATURES.md
│   └── features/               # Detailed feature docs
│
└── public/                     # Static assets
```

## Feature Module Structure

Each feature folder follows a consistent pattern:

```
features/{feature-name}/
├── actions.ts          # Server Actions (entry points)
├── service.ts          # Business logic (optional)
├── validator.ts        # Zod schemas (optional)
├── types.ts            # TypeScript interfaces (optional)
└── components/         # Feature-specific components
```

## Component Placement Rules

| Condition | Location |
|-----------|----------|
| Used by **1 page only** | `app/{route}/_components/` |
| Used by **2+ pages** in same feature | `features/{name}/components/` |
| Used **across features** | `components/shared/` |

## Data Flow

```
[Client Component] 
       ↓
[Server Action] (features/*/actions.ts)
       ↓
[Service Layer] (features/*/service.ts)
       ↓
[Database] (db/index.ts + Drizzle ORM)
```

## Authentication

- Cookie-based sessions via `lib/auth.ts`
- Role-based access control (Admin, Dosen, Mahasiswa)
- Middleware protection for routes

## Key Design Decisions

1. **Feature-based over layer-based**: Easier to navigate related code
2. **Colocated components**: Page-specific components stay with their routes
3. **Thin actions, thick services**: Actions only call services + revalidate
4. **TypeScript strict mode**: Full type safety throughout
5. **Server Components by default**: `'use client'` only when needed
