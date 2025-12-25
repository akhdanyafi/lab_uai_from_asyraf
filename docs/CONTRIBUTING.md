# Contributing Guide

Thank you for your interest in contributing to LAB_UAI.

## Development Workflow

1.  **Branching**: Create a new branch for your feature or fix.
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **Coding Standards**:
    - Use **TypeScript** for all new files.
    - Follow the **feature-based** folder structure.
    - Use **Tailwind CSS** for styling. Avoid inline styles or CSS modules.
3.  **Commits**: Write clear, descriptive commit messages.

## Code Organization

### Adding a New Feature

1. **Create a feature folder** in `features/`:
   ```
   features/my-feature/
   ├── actions.ts       # Server actions
   ├── service.ts       # Business logic (optional)
   ├── validator.ts     # Zod schemas (optional)
   ├── types.ts         # TypeScript types (optional)
   └── components/      # Feature components (optional)
   ```

2. **Create the actions file**:
   ```typescript
   // features/my-feature/actions.ts
   'use server';
   import { MyFeatureService } from './service';
   import { revalidatePath } from 'next/cache';
   
   export async function createFeature(data: CreateInput) {
       await MyFeatureService.create(data);
       revalidatePath('/my-feature');
   }
   ```

3. **Create the service file** (business logic):
   ```typescript
   // features/my-feature/service.ts
   import { db } from '@/db';
   
   export class MyFeatureService {
       static async create(data: CreateInput) { ... }
       static async getAll() { ... }
   }
   ```

4. **Add validation** (optional):
   ```typescript
   // features/my-feature/validator.ts
   import { z } from 'zod';
   
   export const CreateFeatureSchema = z.object({
       name: z.string().min(2),
   });
   ```

### Database Changes

If your change involves the database schema:

1. Modify files in `db/schema/`.
2. Run `npm run db:push` to apply changes.
3. Update seeds in `db/seeds/` if needed.

### Adding Seed Data

Add new seed functions to `db/seeds/initial.seed.ts`:
```typescript
export async function seedMyFeature() {
    // seed logic
}
```

## Best Practices

- **Service Layer**: Put all business logic in services, not in actions.
- **Server Actions**: Keep them thin - just call services and revalidate.
- **Validators**: Use Zod schemas for all user input validation.
- **Client vs Server Components**: Use `"use client"` only when necessary.
- **Type Safety**: Avoid using `any`. Define proper interfaces/types.

## File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| **Components** | `PascalCase.tsx` | `HeroCarousel.tsx`, `UserForm.tsx` |
| **Actions** | `actions.ts` | `features/loans/actions.ts` |
| **Services** | `service.ts` | `features/loans/service.ts` |
| **Validators** | `validator.ts` | `features/loans/validator.ts` |
| **Types** | `types.ts` | `features/loans/types.ts` |
| **Schema** | `kebab-case.ts` | `db/schema/users.ts` |
| **Pages** | `page.tsx` | Next.js convention |
| **Layouts** | `layout.tsx` | Next.js convention |

## Component Placement Rules

| Condition | Location |
|-----------|----------|
| **1 page only** | `app/{route}/_components/` |
| **2+ pages** in same feature | `features/{name}/components/` |
| **Cross-feature** shared | `components/shared/` |

### Important Rules

1. **Feature-first**: All feature code lives in `features/` folder
2. **Actions use relative imports**: `import { Service } from './service'`
3. **Components use PascalCase**: `UserForm.tsx` not `user-form.tsx`
4. **Colocated page components**: Place in `_components/` within route folder
