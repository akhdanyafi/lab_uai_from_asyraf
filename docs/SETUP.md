# Setup Guide

Follow these steps to get the LAB_UAI project running on your local machine.

## Prerequisites

- **Node.js**: Version 20 or higher is recommended.
- **MySQL**: Ensure you have a MySQL server running (e.g., via XAMPP, Docker, or native installation).
- **Package Manager**: NPM (comes with Node.js).

## Installation

1.  **Clone the repository** (if applicable) or navigate to the project directory.

2.  **Install dependencies**:
    ```bash
    npm install
    ```

## Environment Configuration

Create a `.env` file in the root directory. You can duplicate `.env.example` if it exists.
The following environment variables are required:

```env
# Database Connection String
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE_NAME"

# Example:
# DATABASE_URL="mysql://root:@localhost:3306/lab_uai"
```

## Database Setup

This project uses Drizzle ORM.

1.  **Generate SQL migration files**:
    ```bash
    npm run db:generate
    ```

2.  **Push schema to the database**:
    ```bash
    npm run db:push
    ```
    *Note: `db:push` is useful for rapid prototyping. For production, consider using `db:migrate` with migration files.*

3.  **Seed initial data** (Recommended):
    
    The seed functions are located in `db/seeds/initial.seed.ts` and include:
    - Default roles (Admin, Mahasiswa, Dosen)
    - Admin user (admin@lab-uai.ac.id / admin123)
    - Sample rooms, categories, and courses
    
    To run seeds, you can use ts-node or tsx:
    ```bash
    npx tsx -e "import { runAllSeeds } from './db/seeds'; runAllSeeds();"
    ```

## Running the Application

1.  **Start the development server**:
    ```bash
    npm run dev
    ```

2.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
lib/
├── actions/      # Server Actions (entry points)
├── services/     # Business logic
├── validators/   # Zod validation schemas
└── ...

db/
├── schema/       # Database models
├── seeds/        # Seed data
└── ...
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed structure.

## Additional Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |
| `npm run db:generate` | Generate migration files |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Launch Drizzle Studio |
