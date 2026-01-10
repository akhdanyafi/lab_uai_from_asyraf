# Database Seeding Guide

Comprehensive guide for seeding the LAB UAI database with sample data.

## 📋 Overview

The seeding system automatically populates all database tables with realistic Indonesian sample data, including:

- **Users**: Admin, Lecturers (Dosen), and Students (Mahasiswa)
- **Practicum**: Modules (Simple repository)
- **Facilities**: Rooms, Bookings, Inventory Items, Loans, Lab Attendance
- **Content**: Publications, Governance Documents, Hero Photos

## 🚀 Quick Start

### 1. Run the Seed Command

```powershell
npm run db:seed
```

This will:
1. Create the upload folder structure automatically
2. Seed all database tables with sample data
3. Display summary and test credentials

### 2. Add Your Files

After seeding, add actual files to match the paths used in seed data:

```
public/uploads/
├── modules/               # PDF files: modul-1.pdf, modul-2.pdf, etc.
├── publications/          # PDF files: publication-1.pdf, publication-2.pdf, etc.
├── governance/            # PDF files: sop-1.pdf, lpj-bulanan-1.pdf, etc.
│   └── covers/           # Cover images: sop-1.jpg, lpj-bulanan-1.jpg, etc.
└── photos/               # Hero images: hero-1.jpg, hero-2.jpg, etc.
```

## 📊 Sample Data Quantities

Default quantities (configured in `db/seeds/seed.config.ts`):

| Category | Item | Quantity |
|----------|------|----------|
| **Users** | Students | 12 |
| | Lecturers | 4 |
| | Admins | 1 |
| **Practicum** | Modules | 3 |
| | | |
| **Facilities** | Rooms | 5 |
| | Room Bookings | 15 |
| | Lab Attendance | 20 |
| | Item Loans | 10 |
| **Content** | Publications | 8 |
| | Hero Photos | 6 |
| | Governance Docs | 4 |

## 🔐 Test Credentials

All test accounts use the password: **`password123`**

### Admin Account
- **Email**: `admin@lab.ac.id`
- **Identifier**: `ADMIN001`
- **Password**: `password123`

### Lecturer Accounts
| Name | Email | NIDN | Password |
|------|-------|------|----------|
| Dr. Budi Santoso, M.Kom | budi.santoso@lab.ac.id | 0001088901 | password123 |
| Siti Nurhaliza, S.Kom, M.T | siti.nurhaliza@lab.ac.id | 0002089502 | password123 |
| Ahmad Hidayat, M.Cs | ahmad.hidayat@lab.ac.id | 0003089203 | password123 |
| Dewi Lestari, S.T, M.Kom | dewi.lestari@lab.ac.id | 0004089804 | password123 |

### Student Accounts
| Name | Email | NIM | Batch | Study Type | Program Studi | Dosen Pembimbing | Password |
|------|-------|-----|-------|------------|---------------|------------------|----------|
| Andi Wijaya | andi.wijaya@student.ac.id | 2201010001 | 2022 | Reguler | Informatika | Dr. Budi Santoso | password123 |
| Rina Maharani | rina.maharani@student.ac.id | 2201010002 | 2022 | Reguler | Informatika | Siti Nurhaliza | password123 |
| Dimas Pradipta | dimas.pradipta@student.ac.id | 2201010003 | 2022 | Hybrid | Informatika | Ahmad Hidayat | password123 |
| Fitri Handayani | fitri.handayani@student.ac.id | 2201010004 | 2022 | Reguler | Informatika | Dewi Lestari | password123 |
| Reza Firmansyah | reza.firmansyah@student.ac.id | 2301010001 | 2023 | Reguler | Informatika | Dr. Budi Santoso | password123 |
| Sari Permata | sari.permata@student.ac.id | 2301010002 | 2023 | Hybrid | Informatika | Siti Nurhaliza | password123 |
| Yudi Setiawan | yudi.setiawan@student.ac.id | 2301010003 | 2023 | Reguler | Informatika | Ahmad Hidayat | password123 |
| Maya Kusuma | maya.kusuma@student.ac.id | 2301010004 | 2023 | Reguler | Informatika | Dewi Lestari | password123 |
| Fajar Nugroho | fajar.nugroho@student.ac.id | 2401010001 | 2024 | Reguler | Informatika | Dr. Budi Santoso | password123 |
| Indah Sari | indah.sari@student.ac.id | 2401010002 | 2024 | Hybrid | Informatika | Siti Nurhaliza | password123 |
| Arief Rahman | arief.rahman@student.ac.id | 2401010003 | 2024 | Reguler | Informatika | Ahmad Hidayat | password123 |
| Linda Wati | linda.wati@student.ac.id | 2401010004 | 2024 | Reguler | Informatika | Dewi Lestari | password123 |

## ⚙️ Customization

### Adjusting Quantities

Edit `db/seeds/seed.config.ts` to customize sample data quantities.

### Adding Custom Sample Data

Edit the `SAMPLE_DATA` object in `db/seeds/seed.config.ts` to add custom names or titles.

## 🔍 Data Relationships

The seed system ensures proper foreign key relationships:

```
roles → users
items → itemLoans
rooms → roomBookings
```

## 📁 File Naming Convention

### Modules
Pattern: `modul-{number}.pdf`
- Example: `modul-1.pdf`, `modul-2.pdf`

### Reports
*(System simplified, no report files needed)*

### Publications
Pattern: `publication-{number}.pdf`
- Example: `publication-1.pdf`, `publication-2.pdf`

### Governance Documents
Pattern: `{type}-{number}.pdf` and `{type}-{number}.jpg` (for covers)
- Example: `sop-1.pdf`, `sop-1.jpg`, `lpj-bulanan-2.pdf`

### Hero Photos
Pattern: `hero-{number}.jpg`
- Example: `hero-1.jpg`, `hero-2.jpg`

## 🧹 Clearing/Reseeding

### Full Reset
1. Drop all tables:
   ```powershell
   # Use drizzle-kit or manual SQL
   ```

2. Push schema again:
   ```powershell
   npm run db:push
   ```

3. Run seed:
   ```powershell
   npm run db:seed
   ```

### Partial Reseed

The seed functions are idempotent - they check for existing data and skip if present. To reseed specific tables:

1. Manually delete records from specific tables
2. Run `npm run db:seed` again

## 🐛 Troubleshooting

### "Table already exists" errors
- The seed is safe to run multiple times
- It will skip tables that already have data

### Foreign key constraint errors
- Ensure you're running the full seed (not individual functions)
- The order of seeding is important (roles → users → items → etc.)

### "File not found" when testing
- Seeds only create database records with file paths
- You need to manually add actual files to `public/uploads/`
- The app will show broken links until files are added

### Database connection errors
- Check your `.env` file database credentials
- Ensure MySQL is running
- Verify connection limit in `db/index.ts`

## 📝 Script Files

- `db/seeds/seed.config.ts` - Configuration and sample data
- `db/seeds/comprehensive.seed.ts` - Main seeding logic
- `db/seeds/create-upload-structure.ts` - Folder creation utility
- `db/seeds/run-seed.ts` - Entry point script
- `db/seeds/initial.seed.ts` - Legacy seed (now superseded)

## 🔒 Production Notes

> **⚠️ WARNING**: Never run seeds in production!

The seed system is for development and testing only. For production:

1. Add condition to prevent seeding:
   ```typescript
   if (process.env.NODE_ENV === 'production') {
     throw new Error('Seeding is disabled in production');
   }
   ```

2. Use migration scripts for production data
3. Never commit real user data to version control

## 🤝 Contributing

When adding new tables to the schema:

1. Add seed function to `comprehensive.seed.ts`
2. Add sample data to `seed.config.ts`
3. Update this documentation
4. Update the `runComprehensiveSeeds()` function to call your new seed
5. Test with `npm run db:seed`

---

**Need Help?** Check the code comments in seed files or ask the development team.
