# Contributing Guide

Thank you for your interest in contributing to LAB_UAI.

## Development Workflow

1.  **Branching**: Create a new branch for your feature or fix.
    ```bash
    git checkout -b feature/my-new-feature
    ```
2.  **Coding Standards**:
    - Use **TypeScript** for all new files.
    - Follow the existing folder structure (e.g., put new UI components in `components/`).
    - Use **Tailwind CSS** for styling. Avoid inline styles or CSS modules unless necessary.
3.  **Commits**: Write clear, descriptive commit messages.

## Database Changes

If your change involves the database schema:
1.  Modify the files in `db/schema/`.
2.  Run `npm run db:push` to apply changes to your local DB during development.
3.  Ensure you verify relationships and constraints.

## Best Practices

- **Server Actions**: Use Server Actions for all data mutations (`POST`, `PUT`, `DELETE`).
- **Client vs Server Components**: Use `"use client"` only when necessary (e.g., for interactivity, hooks). Default to Server Components for data fetching.
- **Type Safety**: Avoid using `any`. Define proper interfaces/types for props and data.
