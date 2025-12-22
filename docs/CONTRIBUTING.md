# Contributing Guide

Thank you for your interest in contributing to LAB_UAI.

## Development Workflow

1.  **Branching**: Create a new branch for your feature or fix.
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **Coding Standards**:
    - Use **TypeScript** for all new files.
    - Follow the existing folder structure.
    - Use **Tailwind CSS** for styling. Avoid inline styles or CSS modules.
3.  **Commits**: Write clear, descriptive commit messages.

## Code Organization

### Adding Business Logic

1. **Create a Service** in `lib/services/`:
   ```typescript
   // lib/services/my-feature.service.ts
   export class MyFeatureService {
       static async create(data: CreateInput) { ... }
       static async getAll() { ... }
   }
   ```

2. **Create a Server Action** in `lib/actions/`:
   ```typescript
   // lib/actions/my-feature.ts
   'use server';
   import { MyFeatureService } from '@/lib/services/my-feature.service';
   import { revalidatePath } from 'next/cache';
   
   export async function createFeature(data: CreateInput) {
       await MyFeatureService.create(data);
       revalidatePath('/my-feature');
   }
   ```

3. **Add Validation** in `lib/validators/`:
   ```typescript
   // lib/validators/my-feature.validator.ts
   import { z } from 'zod';
   
   export const CreateFeatureSchema = z.object({
       name: z.string().min(2),
       // ...
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
| **Actions** | `kebab-case.ts` (singular) | `loan.ts`, `booking.ts`, `hero-photo.ts` |
| **Services** | `kebab-case.service.ts` | `loan.service.ts`, `user.service.ts` |
| **Validators** | `kebab-case.validator.ts` | `loan.validator.ts`, `user.validator.ts` |
| **Schema** | `kebab-case.ts` | `users.ts`, `inventory.ts` |
| **Seeds** | `kebab-case.seed.ts` | `initial.seed.ts` |
| **Pages** | `page.tsx` | Next.js convention |
| **Layouts** | `layout.tsx` | Next.js convention |

### Important Rules

1. **Actions use singular form**: `loan.ts` not `loans.ts`
2. **Components use PascalCase**: `UserForm.tsx` not `user-form.tsx`
3. **All other backend files use kebab-case**: `hero-photo.service.ts`
4. **Colocated components**: Place in `_components/` within route folder
