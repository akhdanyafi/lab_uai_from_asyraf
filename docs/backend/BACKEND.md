# Backend Documentation

Dokumentasi lengkap backend sistem LAB_UAI, mencakup Entity Relationship Diagram (ERD), relasi antar tabel, dan flowchart untuk setiap fitur utama.

## Entity Relationship Diagram (ERD)

ERD dibagi menjadi beberapa diagram per domain agar lebih compact dan mudah di-screenshot.

---

### ERD 1: User & Role Domain

```mermaid
erDiagram
    ROLES {
        int id PK
        varchar name UK
    }
    USERS {
        int id PK
        int role_id FK
        varchar full_name
        varchar identifier UK
        varchar email
        varchar password_hash
        enum status
        int batch
        enum study_type
        varchar program_studi
        varchar dosen_pembimbing
        datetime created_at
    }
    ROLES ||--o{ USERS : "memiliki"
```

> **Status**: `Active`, `Pending`, `Rejected`, `Pre-registered`  
> **Study Type**: `Reguler`, `Hybrid`

---

### ERD 2: Inventory & Item Loan Domain

```mermaid
erDiagram
    ITEM_CATEGORIES {
        int id PK
        varchar name
    }
    ROOMS {
        int id PK
        varchar name
        varchar location
        int capacity
        enum status
    }
    ITEMS {
        int id PK
        int category_id FK
        int room_id FK
        varchar name
        text description
        varchar qr_code UK
        enum status
    }
    ITEM_LOANS {
        int id PK
        int student_id FK
        int item_id FK
        int validator_id FK
        datetime request_date
        datetime return_plan_date
        enum status
        enum return_status
    }
    ITEM_CATEGORIES ||--o{ ITEMS : "kategori"
    ROOMS ||--o{ ITEMS : "lokasi"
    ITEMS ||--o{ ITEM_LOANS : "dipinjam"
```

> **Item Status**: `Tersedia`, `Dipinjam`, `Maintenance`  
> **Loan Status**: `Pending`, `Disetujui`, `Ditolak`, `Selesai`, `Terlambat`  
> **Return Status**: `Belum`, `Pending`, `Dikembalikan`

---

### ERD 3: Room Booking & Attendance Domain

```mermaid
erDiagram
    ROOMS {
        int id PK
        varchar name
        varchar location
        int capacity
        enum status
    }
    ROOM_BOOKINGS {
        int id PK
        int user_id FK
        int room_id FK
        int validator_id FK
        datetime start_time
        datetime end_time
        text purpose
        varchar organisasi
        enum status
    }
    LAB_ATTENDANCE {
        int id PK
        int user_id FK
        int room_id FK
        varchar purpose
        varchar dosen_penanggung_jawab
        datetime check_in_time
    }
    ROOMS ||--o{ ROOM_BOOKINGS : "dipesan"
    ROOMS ||--o{ LAB_ATTENDANCE : "lokasi"
```

> **Booking Status**: `Pending`, `Disetujui`, `Ditolak`  
> **Room Status**: `Tersedia`, `Maintenance`

---

### ERD 4: Publication Domain

```mermaid
erDiagram
    PUBLICATIONS {
        int id PK
        int uploader_id FK
        int submitter_id FK
        varchar author_name
        varchar title
        text abstract
        text keywords
        varchar file_path
        varchar link
        int view_count
        enum status
        datetime publish_date
    }
    PUBLICATION_LIKES {
        int id PK
        int publication_id FK
        int user_id FK
        datetime created_at
    }
    PUBLICATIONS ||--o{ PUBLICATION_LIKES : "diberikan"
```

> **Publication Status**: `Pending`, `Published`, `Rejected`

---

### ERD 5: Content Management Domain

```mermaid
erDiagram
    GOVERNANCE_DOCS {
        int id PK
        int admin_id FK
        varchar title
        varchar file_path
        varchar cover_path
        enum type
        datetime created_at
    }
    PRACTICUM_MODULES {
        int id PK
        varchar name
        text description
        varchar file_path
        text subjects
        datetime created_at
        datetime updated_at
    }
    HERO_PHOTOS {
        int id PK
        varchar title
        text description
        text image_url
        text link
        datetime created_at
    }
```

> **Doc Type**: `SOP`, `LPJ Bulanan`

---

### ERD Lengkap (Relasi Antar Domain)

```mermaid
erDiagram
    USERS ||--o{ ITEM_LOANS : "meminjam"
    USERS ||--o{ ROOM_BOOKINGS : "memesan"
    USERS ||--o{ LAB_ATTENDANCE : "absen"
    USERS ||--o{ PUBLICATIONS : "submit"
    USERS ||--o{ PUBLICATION_LIKES : "like"
    USERS ||--o{ GOVERNANCE_DOCS : "upload"
```

---

## Relasi Antar Tabel

### Ringkasan Relasi

| Tabel Source | Relasi | Tabel Target | Keterangan |
|--------------|--------|--------------|------------|
| `users` | Many-to-One | `roles` | Setiap user memiliki 1 role |
| `items` | Many-to-One | `item_categories` | Setiap item memiliki 1 kategori |
| `items` | Many-to-One | `rooms` | Setiap item disimpan di 1 ruangan |
| `item_loans` | Many-to-One | `users` | Student yang meminjam |
| `item_loans` | Many-to-One | `users` | Admin yang memvalidasi |
| `item_loans` | Many-to-One | `items` | Item yang dipinjam |
| `room_bookings` | Many-to-One | `users` | User yang memesan |
| `room_bookings` | Many-to-One | `users` | Admin yang memvalidasi |
| `room_bookings` | Many-to-One | `rooms` | Ruangan yang dipesan |
| `lab_attendance` | Many-to-One | `users` | User yang check-in |
| `lab_attendance` | Many-to-One | `rooms` | Ruangan yang dimasuki |
| `governance_docs` | Many-to-One | `users` | Admin yang upload |
| `publications` | Many-to-One | `users` | Admin/Dosen yang publish |
| `publications` | Many-to-One | `users` | User yang submit draft |
| `publication_likes` | Many-to-One | `publications` | Publikasi yang di-like |
| `publication_likes` | Many-to-One | `users` | User yang like |

### Diagram Relasi Tingkat Tinggi

```mermaid
graph TB
    subgraph "Core Entities"
        USERS[("👤 USERS")]
        ROLES[("🏷️ ROLES")]
    end
    
    subgraph "Inventory Management"
        ROOMS[("🏠 ROOMS")]
        ITEMS[("📦 ITEMS")]
        CATEGORIES[("📁 CATEGORIES")]
    end
    
    subgraph "Transactions"
        LOANS[("🔄 ITEM_LOANS")]
        BOOKINGS[("📅 ROOM_BOOKINGS")]
        ATTENDANCE[("✅ LAB_ATTENDANCE")]
    end
    
    subgraph "Content Management"
        MODULES[("📚 PRACTICUM_MODULES")]
        DOCS[("📄 GOVERNANCE_DOCS")]
        PUBS[("📰 PUBLICATIONS")]
        LIKES[("❤️ PUBLICATION_LIKES")]
        HERO[("🖼️ HERO_PHOTOS")]
    end
    
    ROLES --> USERS
    
    USERS --> LOANS
    USERS --> BOOKINGS
    USERS --> ATTENDANCE
    USERS --> DOCS
    USERS --> PUBS
    USERS --> LIKES
    
    CATEGORIES --> ITEMS
    ROOMS --> ITEMS
    ROOMS --> BOOKINGS
    ROOMS --> ATTENDANCE
    
    ITEMS --> LOANS
    PUBS --> LIKES
```

---

## Flowchart Fitur

Flowchart dibagi per proses agar lebih compact dan mudah di-screenshot.

---

### 1. Login Flow

```mermaid
flowchart LR
    A[Input Email/NIM] --> B{User Ada?}
    B -->|No| C[❌ Error]
    B -->|Yes| D{Password OK?}
    D -->|No| E[❌ Error]
    D -->|Yes| F{Status?}
    F -->|Active| G[Create JWT] --> H[✅ Login]
    F -->|Pending/Rejected| I[❌ Error]
```

---

### 2. Session Check Flow

```mermaid
flowchart LR
    A[Request] --> B{Cookie?}
    B -->|No| C[Redirect Login]
    B -->|Yes| D{Token Valid?}
    D -->|No| C
    D -->|Yes| E[✅ Return Session]
```

---

### 3. User Registration Flow

```mermaid
flowchart LR
    A[Submit Form] --> B{Email/NIM Unik?}
    B -->|No| C[❌ Error]
    B -->|Yes| D[Hash Password]
    D --> E[Create User: Pending]
    E --> F[✅ Registrasi OK]
```

---

### 4. User Validation Flow (Admin)

```mermaid
flowchart LR
    A[Admin Review] --> B{Keputusan}
    B -->|Approve| C[Status: Active] --> D[✅ Bisa Login]
    B -->|Reject| E[Status: Rejected] --> F[❌ Tidak Bisa Login]
```

---

### 5. Item Loan Request Flow

```mermaid
flowchart LR
    A[Scan QR/Pilih Item] --> B{Tersedia?}
    B -->|No| C[❌ Error]
    B -->|Yes| D[Isi Form]
    D --> E{Surat Izin?}
    E -->|Yes| F[Auto-Approve]
    E -->|No| G[Pending]
```

---

### 6. Item Loan Approval Flow

```mermaid
flowchart LR
    A[Admin Review] --> B{Keputusan}
    B -->|Approve| C[Disetujui] --> D[Item: Dipinjam]
    B -->|Reject| E[Ditolak]
```

---

### 7. Item Return Flow

```mermaid
flowchart LR
    A[Request Return] --> B{Upload Foto?}
    B -->|Yes| C[Auto-Approve]
    B -->|No| D[Pending Admin]
    D --> E{Keputusan}
    E -->|Approve| C
    E -->|Reject| F[Belum]
    C --> G[Item: Tersedia]
```

---

### 8. Room Booking Request Flow

```mermaid
flowchart LR
    A[Pilih Ruangan] --> B{Tersedia?}
    B -->|No| C[❌ Bentrok]
    B -->|Yes| D[Isi Form]
    D --> E{Surat?}
    E -->|Yes| F[Auto-Approve]
    E -->|No| G[Pending]
```

---

### 9. Room Booking Approval Flow

```mermaid
flowchart LR
    A[Admin Review] --> B{Keputusan}
    B -->|Approve| C[Disetujui]
    B -->|Reject| D[Ditolak]
```

---

### 10. Lab Attendance Flow

```mermaid
flowchart LR
    A[Input NIM] --> B{Terdaftar?}
    B -->|No| C[❌ Error]
    B -->|Yes| D[Pilih Ruangan]
    D --> E[Input Tujuan]
    E --> F[Create Record]
    F --> G[✅ Check-in OK]
```

---

### 11. Publication Submit Flow

```mermaid
flowchart LR
    A[User Submit Draft] --> B[Status: Pending]
    B --> C[Admin Review]
    C --> D{Keputusan}
    D -->|Approve| E[Published]
    D -->|Reject| F[Rejected]
```

---

### 12. Publication Direct Publish (Admin)

```mermaid
flowchart LR
    A[Admin Upload] --> B[Status: Published] --> C[✅ Live]
```

---

### 13. Publication Like Flow

```mermaid
flowchart LR
    A[Click Like] --> B{Already Liked?}
    B -->|Yes| C[Remove Like]
    B -->|No| D[Add Like]
```

---

### 14. Practicum Module Upload Flow

```mermaid
flowchart LR
    A[Admin/Dosen] --> B[Input Data]
    B --> C[Upload PDF]
    C --> D[Pilih Subject]
    D --> E[✅ Save]
```

---

### 15. Practicum Module View Flow

```mermaid
flowchart LR
    A[Mahasiswa] --> B[List Modul]
    B --> C[Filter/Search]
    C --> D[View Detail]
    D --> E[Download PDF]
```

---

### 16. Governance Doc Upload Flow

```mermaid
flowchart LR
    A[Admin] --> B[Pilih Type]
    B --> C[Input Title]
    C --> D[Upload PDF]
    D --> E{Cover?}
    E -->|Yes| F[Upload Cover]
    E -->|No| G[Skip]
    F --> H[✅ Save]
    G --> H
```

---

## API Endpoints (Server Actions)

### Authentication (`features/auth/actions.ts`)

| Action | Deskripsi | Role |
|--------|-----------|------|
| `login(formData)` | Login user | Public |
| `logout()` | Logout user | Authenticated |

### Users (`features/users/actions.ts`)

| Action | Deskripsi | Role |
|--------|-----------|------|
| `getUsers()` | Get all users | Admin |
| `getRoles()` | Get all roles | Admin |
| `getLecturers()` | Get dosen list | Public |
| `createUser(data)` | Create user | Admin |
| `updateUser(id, data)` | Update user | Admin |
| `deleteUser(id)` | Delete user | Admin |
| `getPendingUsers()` | Get pending registrations | Admin |
| `updateUserStatus(id, status)` | Approve/reject user | Admin |
| `updateUserProfile(data)` | Update own profile | Authenticated |

### Inventory (`features/inventory/actions.ts`)

| Action | Deskripsi | Role |
|--------|-----------|------|
| `getRooms()` | Get all rooms | Public |
| `createRoom(data)` | Create room | Admin |
| `updateRoom(id, data)` | Update room | Admin |
| `deleteRoom(id)` | Delete room | Admin |
| `updateRoomStatus(id, status)` | Change room status | Admin |
| `getCategories()` | Get item categories | Public |
| `createCategory(data)` | Create category | Admin |
| `updateCategory(id, data)` | Update category | Admin |
| `deleteCategory(id)` | Delete category | Admin |
| `getItems()` | Get all items | Public |
| `createItem(data)` | Create item | Admin |
| `updateItem(id, data)` | Update item | Admin |
| `deleteItem(id)` | Delete item | Admin |
| `updateItemStatus(id, status)` | Change item status | Admin |
| `getItemByQrCode(qrCode)` | Get item by QR | Public |

### Loans (`features/loans/actions.ts`)

| Action | Deskripsi | Role |
|--------|-----------|------|
| `getAvailableItems(categoryId?)` | Get borrowable items | Public |
| `createLoanRequest(data)` | Request loan | Student |
| `getLoanRequests(status?, dates?)` | Get all loans | Admin |
| `updateLoanStatus(id, status, validatorId)` | Approve/reject loan | Admin |
| `deleteLoan(id)` | Delete loan | Admin |
| `getMyLoans(userId)` | Get user's loans | Authenticated |
| `requestItemReturn(loanId, photo?)` | Request return | Student |
| `approveReturn(loanId, validatorId)` | Approve return | Admin |
| `rejectReturn(loanId)` | Reject return | Admin |
| `getPendingReturns()` | Get pending returns | Admin |

### Bookings (`features/bookings/actions.ts`)

| Action | Deskripsi | Role |
|--------|-----------|------|
| `getAllRooms()` | Get all rooms | Public |
| `getLecturers()` | Get dosen list | Public |
| `getRoomAvailability(roomId, date)` | Check availability | Authenticated |
| `createRoomBooking(data)` | Create booking | Authenticated |
| `getBookingRequests(status?, dates?)` | Get all bookings | Admin |
| `deleteBooking(id)` | Delete booking | Admin |
| `updateBookingStatus(id, status, validatorId)` | Approve/reject | Admin |
| `getMyBookings(userId)` | Get user's bookings | Authenticated |
| `getMonthBookings(month, year)` | Get calendar data | Public |

### Attendance (`features/attendance/actions.ts`)

| Action | Deskripsi | Role |
|--------|-----------|------|
| `getRooms()` | Get available rooms | Public |
| `getLecturers()` | Get dosen list | Public |
| `checkIn(nim, roomId, purpose, dosen?)` | Check-in | Public |
| `getTodayAttendanceAction()` | Get today's attendance | Admin |
| `getRoomAttendanceStatsAction()` | Get stats | Admin |

### Publications (`features/publications/actions.ts`)

| Action | Deskripsi | Role |
|--------|-----------|------|
| `createPublication(data)` | Direct publish | Admin |
| `submitPublication(data)` | Submit for review | Authenticated |
| `approvePublication(id, uploaderId, updates?)` | Approve submission | Admin |
| `rejectPublication(id)` | Reject submission | Admin |
| `updatePublication(id, data)` | Edit publication | Admin/Dosen |
| `getPublicPublications(filters?)` | Get published | Public |
| `getPublications(filters?)` | Get all | Admin |
| `getUserPublications(submitterId)` | Get user's submissions | Authenticated |
| `deletePublication(id)` | Delete publication | Admin |
| `togglePublicationLike(pubId, userId)` | Like/unlike | Authenticated |

### Practicum (`features/practicum/actions.ts`)

| Action | Deskripsi | Role |
|--------|-----------|------|
| `getModules()` | Get all modules | Public |
| `getModuleById(id)` | Get module detail | Public |
| `searchModules(query)` | Search modules | Public |
| `getAllSubjects()` | Get subject tags | Public |
| `createModule(data)` | Create module | Admin/Dosen |
| `updateModule(id, data)` | Update module | Admin/Dosen |
| `deleteModule(id)` | Delete module | Admin/Dosen |

### Governance (`features/governance/actions.ts`)

| Action | Deskripsi | Role |
|--------|-----------|------|
| `getGovernanceDocs(type)` | Get docs by type | Public |
| `uploadGovernanceDoc(formData)` | Upload document | Admin |
| `updateGovernanceDoc(id, formData)` | Update document | Admin |
| `deleteGovernanceDoc(id)` | Delete document | Admin |

---

## Status Enums

### User Status
- `Pending` - Menunggu approval admin
- `Active` - Akun aktif
- `Rejected` - Ditolak admin
- `Pre-registered` - Bulk import (belum set password)

### Item Status
- `Tersedia` - Bisa dipinjam
- `Dipinjam` - Sedang dipinjam
- `Maintenance` - Tidak tersedia

### Room Status
- `Tersedia` - Bisa dipesan
- `Maintenance` - Tidak tersedia

### Loan Status
- `Pending` - Menunggu approval
- `Disetujui` - Disetujui, sedang dipinjam
- `Ditolak` - Ditolak admin
- `Selesai` - Sudah dikembalikan
- `Terlambat` - Lewat batas waktu

### Loan Return Status
- `Belum` - Belum request return
- `Pending` - Menunggu approval return
- `Dikembalikan` - Sudah dikembalikan

### Booking Status
- `Pending` - Menunggu approval
- `Disetujui` - Booking confirmed
- `Ditolak` - Ditolak admin

### Publication Status
- `Pending` - Draft menunggu review
- `Published` - Sudah dipublish
- `Rejected` - Ditolak

---

## Database Indexes

| Tabel | Index | Kolom |
|-------|-------|-------|
| `users` | `role_idx` | `role_id` |
| `users` | `batch_idx` | `batch` |
| `items` | `category_idx` | `category_id` |
| `items` | `room_idx` | `room_id` |
| `item_loans` | `student_idx` | `student_id` |
| `item_loans` | `item_idx` | `item_id` |
| `item_loans` | `validator_idx` | `validator_id` |
| `room_bookings` | `user_idx` | `user_id` |
| `room_bookings` | `room_idx` | `room_id` |
| `room_bookings` | `validator_idx` | `validator_id` |
| `lab_attendance` | `user_idx` | `user_id` |
| `lab_attendance` | `room_idx` | `room_id` |
| `lab_attendance` | `check_in_time_idx` | `check_in_time` |
| `governance_docs` | `admin_idx` | `admin_id` |
| `publications` | `uploader_idx` | `uploader_id` |
| `publications` | `submitter_idx` | `submitter_id` |
| `publications` | `status_idx` | `status` |
| `publication_likes` | `publication_idx` | `publication_id` |
| `publication_likes` | `user_idx` | `user_id` |
| `publication_likes` | `unique_like` | `publication_id, user_id` |

---

## File Locations

| Domain | Schema File | Actions File | Service File |
|--------|-------------|--------------|--------------|
| Users | `db/schema/users.ts` | `features/users/actions.ts` | `features/users/service.ts` |
| Inventory | `db/schema/inventory.ts` | `features/inventory/actions.ts` | `features/inventory/service.ts` |
| Bookings | `db/schema/bookings.ts` | `features/bookings/actions.ts` | `features/bookings/service.ts` |
| Loans | `db/schema/inventory.ts` | `features/loans/actions.ts` | `features/loans/service.ts` |
| Attendance | `db/schema/attendance.ts` | `features/attendance/actions.ts` | `features/attendance/service.ts` |
| Practicum | `db/schema/practicum.ts` | `features/practicum/actions.ts` | `features/practicum/service.ts` |
| Governance | `db/schema/others.ts` | `features/governance/actions.ts` | - |
| Publications | `db/schema/others.ts` | `features/publications/actions.ts` | `features/publications/service.ts` |
| Hero Photos | `db/schema/others.ts` | `features/hero-photos/actions.ts` | `features/hero-photos/service.ts` |
| Auth | `db/schema/users.ts` | `features/auth/actions.ts` | - |
