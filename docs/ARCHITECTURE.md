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
│   ├── admin/              # Admin dashboard routes
│   ├── student/            # Student routes
│   ├── lecturer/           # Lecturer routes
│   ├── login/              # Authentication
│   └── page.tsx            # Homepage
│
├── components/             # Reusable UI components
│   ├── governance/         # SOP, LPJ components
│   ├── ui/                 # Generic UI elements
│   └── ...                 # Domain-specific components
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
│   │   ├── users.ts        # Users, roles
│   │   ├── inventory.ts    # Items, loans
│   │   ├── academic.ts     # Modules, reports, sessions
│   │   ├── bookings.ts     # Room bookings
│   │   └── others.ts       # Governance docs, hero photos
│   ├── seeds/              # Database seeders
│   │   └── initial.seed.ts # Initial data seed
│   ├── index.ts            # Database connection
│   └── schema.ts           # Schema exports
│
├── drizzle/                # Database migrations
├── types/                  # TypeScript type definitions
└── middleware.ts           # Auth middleware
```

## Architecture Pattern

### Service Layer Pattern

The backend follows a **Service Layer Pattern** for clean separation of concerns:

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│                  (React Components)                     │
└────────────────────────┬────────────────────────────────┘
                         │ calls
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Server Actions                        │
│              (lib/actions/*.ts)                         │
│    - Thin wrappers for services                         │
│    - Handle revalidatePath()                            │
│    - Next.js specific (cache invalidation)              │
└────────────────────────┬────────────────────────────────┘
                         │ delegates to
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Services                             │
│              (lib/services/*.ts)                        │
│    - Business logic                                     │
│    - Reusable & testable                                │
│    - Framework agnostic                                 │
└────────────────────────┬────────────────────────────────┘
                         │ uses
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   Database Layer                        │
│              (db/schema/*.ts)                           │
│    - Drizzle ORM schemas                                │
│    - Type-safe queries                                  │
└─────────────────────────────────────────────────────────┘
```

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

### Validators

Zod schemas in `lib/validators/` ensure type-safe input validation:
- `loan.validator.ts` - Loan creation/status schemas
- `user.validator.ts` - User CRUD schemas
- `booking.validator.ts` - Booking schemas
- `inventory.validator.ts` - Room, category, item schemas

## Key Concepts

### Authentication
User authentication is handled via server-side sessions/cookies. Middleware (`middleware.ts`) protects routes based on user roles (Admin, Student, Lecturer).

### Database Schema
The database uses foreign key relationships:
- **Users**: Have Roles (Mahasiswa, Dosen, Admin)
- **Inventory**: Items can be borrowed with approval workflows
- **Academic**: Students submit reports for practical sessions
- **Bookings**: Room reservations with status tracking

### Server Actions
Server Actions in `lib/actions/` are thin wrappers that:
1. Call the appropriate service method
2. Handle cache invalidation via `revalidatePath()`
3. Provide type-safe API for frontend components
