# Architecture Overview

This document provides a high-level overview of the LAB_UAI technical architecture.

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: MySQL
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: Custom components with [Lucide React](https://lucide.dev/) icons

## Folder Structure

### `/app`
Contains the application routes and pages (Next.js App Router).
- `(root)` / `page.tsx`: Landing page.
- `/admin`: Protected routes for Administrator dashboard (User management, Validation, Inventory).
- `/student`: Protected routes for Student users (Dashboard, Practical modules).
- `/lecturer`: Protected routes for Lecturers.
- `/login`, `/register`: Authentication pages.

### `/components`
Reusable UI components.
- `/governance`: Components related to governance docs (SOP, LPJ).
- `/ui`: Generic UI elements (Buttons, Inputs, Cards).

### `/db`
Database configuration and schema definitions.
- `index.ts`: Database connection initialization.
- `/schema`: Drizzle schema definitions split by domain:
    - `users.ts`: User accounts, roles, profiles.
    - `inventory.ts`: Lab items, loan requests.
    - `academic.ts`: Modules, practical reports, schedules.
    - `bookings.ts`: Room booking functionality.

### `/lib`
Utility functions and business logic.
- `/actions`: Server Actions for mutating data (e.g., `createUser`, `updateInventory`).
- `utils.ts`: Common helper functions.

## Key Concepts

### Authentication
User authentication is handled via server-side sessions/cookies. Middleware (`middleware.ts`) protects routes based on user roles (Admin, Student, Lecturer).

### Database Schema
The database works heavily with relationships:
- **Users**: Have Roles (mahasiswa, dosen, admin, asisten).
- **Inventory**: Items can be borrowed (`loans` table) with approval workflows.
- **Academic**: Students submit reports (`practical_reports`) for modules.

### Server Actions
Data mutations are primarily handled through Next.js Server Actions located in `lib/actions`, providing type-safe backend interaction directly from UI components.
