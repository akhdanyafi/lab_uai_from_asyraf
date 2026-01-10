# Lab UAI Management System

A comprehensive web application for managing laboratory resources, academic activities, and user administration at Universitas Al Azhar Indonesia.

## Key Features

- **User Roles**: Specialized dashboards for Admins, Lecturers, Students, and Assistants.
- **Inventory Management**: Track lab equipment, manage loans, and handle returns.
- **Room Booking**: Schedule and manage laboratory room usage.
- **Academic Portal**: Manage practical modules, grades, and report submissions.
- **Governance**: Centralized repository for SOPs and LPJs.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MySQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## Quick Start

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Setup Environment**:
    Create `.env` with your `DATABASE_URL`.
3.  **Initialize Database**:
    ```bash
    npm run db:generate
    npm run db:push
    npm run db:seed
    ```
4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## Documentation

For more detailed information, please refer to the documentation:

- [**Setup Guide**](docs/SETUP.md): Detailed installation and configuration instructions.
- [**Architecture**](docs/ARCHITECTURE.md): Overview of the codebase structure and database schema.
- [**Features**](docs/FEATURES.md): Detailed breakdown of system capabilities by role.
- [**Contributing**](docs/CONTRIBUTING.md): Guidelines for development and standard practices.

## License

[Add License Here]
