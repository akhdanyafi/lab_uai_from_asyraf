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

## Folder Structure

```
LAB_UAI/
├── app/                    # Next.js App Router (Frontend)
│   ├── (home)/             # Homepage route group
│   │   ├── _components/    # Colocated homepage components
│   │   └── page.tsx        # Homepage (URL: /)
│   │
│   ├── (auth)/             # Auth route group
│   │   ├── login/          # Login page (URL: /login)
│   │   └── register/       # Register page (URL: /register)
│   │
│   ├── admin/              # Admin dashboard routes
│   │   ├── hero-photos/_components/
│   │   ├── inventory/_components/
│   │   ├── validations/_components/
│   │   ├── practicum/[id]/_components/
│   │   └── layout.tsx
│   │
│   ├── student/            # Student routes
│   │   ├── items/_components/
│   │   └── layout.tsx
│   │
│   ├── lecturer/           # Lecturer routes
│   └── publications/       # Public publications page
│
├── components/             # Shared UI components
│   ├── home/               # Navbar, Footer (shared layout)
│   ├── governance/         # SOP, LPJ components
│   ├── practicum/          # Practicum management
│   ├── academic/           # Academic documents
│   ├── publications/       # Publication components
│   ├── profile/            # Profile components
│   ├── rooms/              # Room booking components
│   ├── shared/             # Shared utilities (CalendarView, etc.)
│   ├── layout/             # Layout components (Sidebar, Header)
│   ├── ui/                 # Generic UI elements
│   └── auth/               # Auth form components
│
├── lib/                    # Backend logic
│   ├── actions/            # Server Actions (thin entry points)
│   ├── services/           # Business logic layer
│   ├── validators/         # Zod validation schemas
│   ├── auth.ts             # Authentication utilities
│   ├── upload.ts           # File upload utilities
│   └── utils.ts            # Common helpers
│
├── db/                     # Database layer
│   ├── schema/             # Drizzle schema definitions
│   ├── seeds/              # Database seeders
│   ├── index.ts            # Database connection
│   └── schema.ts           # Schema exports
│
├── drizzle/                # Database migrations
├── types/                  # TypeScript type definitions
└── middleware.ts           # Auth middleware
```

## Component Organization

### Route Groups

Route groups (folders with parentheses) organize routes without affecting URLs:

| Folder | Purpose | URL |
|--------|---------|-----|
| `(home)` | Homepage + components | `/` |
| `(auth)` | Login & Register | `/login`, `/register` |

### Colocation Strategy

Single-use components are colocated with their routes using `_components/`:

| Route | Colocated Components |
|-------|---------------------|
| `admin/hero-photos` | HeroPhotoManager |
| `admin/validations` | ValidationTabs, LoanHistoryFilter |
| `admin/inventory` | InventoryManager, RoomsView, ItemsView, CategoriesView |
| `admin/practicum/[id]` | GradingTable |
| `student/items` | ItemCard, ItemFilter |
| `(home)` | HeroSection, HeroCarousel, HomeCalendar, SOPSection, PublicationSection, AnnouncementSection |

Shared components remain in `components/` organized by feature.

## Architecture Pattern

### Service Layer Pattern

The backend follows a **Service Layer Pattern** for clean separation of concerns:

```
Frontend (React) → Server Actions → Services → Database
```

| Layer | Location | Responsibility |
|-------|----------|----------------|
| Server Actions | `lib/actions/` | Thin wrappers, cache invalidation |
| Services | `lib/services/` | Business logic, testable |
| Validators | `lib/validators/` | Zod input validation |
| Database | `db/schema/` | Drizzle ORM schemas |

### Services

| Service | File | Description |
|---------|------|-------------|
| `LoanService` | loan.service.ts | Item loan CRUD, status updates |
| `UserService` | user.service.ts | User management, auth helpers |
| `BookingService` | booking.service.ts | Room booking logic |
| `InventoryService` | inventory.service.ts | Rooms, categories, items |
| `DashboardService` | dashboard.service.ts | Statistics aggregation |
| `PublicationService` | publication.service.ts | Publication management |
| `HeroPhotoService` | hero-photo.service.ts | Hero carousel photos |

## Key Concepts

### Authentication
User authentication is handled via server-side sessions/cookies. Middleware (`middleware.ts`) protects routes based on user roles (Admin, Student, Lecturer).

### Database Schema
The database uses foreign key relationships:
- **Users**: Have Roles (Mahasiswa, Dosen, Admin)
- **Inventory**: Items can be borrowed with approval workflows
- **Academic**: Students submit reports for practical sessions
- **Bookings**: Room reservations with status tracking
