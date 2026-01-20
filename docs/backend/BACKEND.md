# Backend Documentation

Dokumentasi lengkap backend sistem LAB_UAI, mencakup Entity Relationship Diagram (ERD), relasi antar tabel, dan flowchart untuk setiap fitur utama.

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    %% ==================== USER DOMAIN ====================
    ROLES {
        int id PK
        varchar name UK "Admin, Mahasiswa, Dosen"
    }
    
    USERS {
        int id PK
        int role_id FK
        varchar full_name
        varchar identifier UK "NIM atau NIDN"
        varchar email
        varchar password_hash
        enum status "Active, Pending, Rejected, Pre-registered"
        int batch "Angkatan, e.g. 2022"
        enum study_type "Reguler, Hybrid"
        varchar program_studi
        varchar dosen_pembimbing
        datetime created_at
    }
    
    ROLES ||--o{ USERS : "has"
    
    %% ==================== INVENTORY DOMAIN ====================
    ROOMS {
        int id PK
        varchar name
        varchar location
        int capacity
        enum status "Tersedia, Maintenance"
    }
    
    ITEM_CATEGORIES {
        int id PK
        varchar name
    }
    
    ITEMS {
        int id PK
        int category_id FK
        int room_id FK
        varchar name
        text description
        varchar qr_code UK
        enum status "Tersedia, Dipinjam, Maintenance"
    }
    
    ITEM_CATEGORIES ||--o{ ITEMS : "categorizes"
    ROOMS ||--o{ ITEMS : "stores"
    
    %% ==================== LOAN DOMAIN ====================
    ITEM_LOANS {
        int id PK
        int student_id FK
        int item_id FK
        int validator_id FK
        datetime request_date
        datetime return_plan_date
        datetime actual_return_date
        enum status "Pending, Disetujui, Ditolak, Selesai, Terlambat"
        varchar organisasi
        datetime start_time
        datetime end_time
        varchar purpose
        varchar surat_izin
        varchar dosen_pembimbing
        text software "JSON array"
        enum notification_read "0, 1"
        varchar return_photo
        enum return_status "Belum, Pending, Dikembalikan"
        enum return_notification_read "0, 1"
    }
    
    USERS ||--o{ ITEM_LOANS : "borrows (student)"
    USERS ||--o{ ITEM_LOANS : "validates (admin)"
    ITEMS ||--o{ ITEM_LOANS : "is borrowed"
    
    %% ==================== BOOKING DOMAIN ====================
    ROOM_BOOKINGS {
        int id PK
        int user_id FK
        int room_id FK
        int validator_id FK
        datetime start_time
        datetime end_time
        text purpose
        varchar organisasi
        int jumlah_peserta
        varchar surat_permohonan
        varchar dosen_pembimbing
        enum status "Pending, Disetujui, Ditolak"
        enum notification_read "0, 1"
    }
    
    USERS ||--o{ ROOM_BOOKINGS : "books"
    USERS ||--o{ ROOM_BOOKINGS : "validates"
    ROOMS ||--o{ ROOM_BOOKINGS : "is booked"
    
    %% ==================== ATTENDANCE DOMAIN ====================
    LAB_ATTENDANCE {
        int id PK
        int user_id FK
        int room_id FK
        varchar purpose
        varchar dosen_penanggung_jawab
        datetime check_in_time
    }
    
    USERS ||--o{ LAB_ATTENDANCE : "attends"
    ROOMS ||--o{ LAB_ATTENDANCE : "hosts"
    
    %% ==================== PRACTICUM DOMAIN ====================
    PRACTICUM_MODULES {
        int id PK
        varchar name
        text description
        varchar file_path
        text subjects "JSON array"
        datetime created_at
        datetime updated_at
    }
    
    %% ==================== GOVERNANCE DOMAIN ====================
    GOVERNANCE_DOCS {
        int id PK
        int admin_id FK
        varchar title
        varchar file_path
        varchar cover_path
        enum type "SOP, LPJ Bulanan"
        datetime created_at
    }
    
    USERS ||--o{ GOVERNANCE_DOCS : "uploads"
    
    %% ==================== PUBLICATION DOMAIN ====================
    PUBLICATIONS {
        int id PK
        int uploader_id FK
        int submitter_id FK
        varchar author_name
        varchar title
        text abstract
        text keywords "JSON array"
        varchar file_path
        varchar link
        int view_count
        enum status "Pending, Published, Rejected"
        datetime publish_date
        datetime created_at
    }
    
    PUBLICATION_LIKES {
        int id PK
        int publication_id FK
        int user_id FK
        datetime created_at
    }
    
    USERS ||--o{ PUBLICATIONS : "uploads"
    USERS ||--o{ PUBLICATIONS : "submits"
    PUBLICATIONS ||--o{ PUBLICATION_LIKES : "receives"
    USERS ||--o{ PUBLICATION_LIKES : "gives"
    
    %% ==================== HOMEPAGE DOMAIN ====================
    HERO_PHOTOS {
        int id PK
        varchar title
        text description
        text image_url
        text link
        datetime created_at
    }
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

### 1. Authentication Flow

```mermaid
flowchart TD
    subgraph "Login Flow"
        A[User Input Email/NIM + Password] --> B{Cari User}
        B -->|Not Found| C[❌ Error: User not found]
        B -->|Found| D{Password Valid?}
        D -->|No| E[❌ Error: Password salah]
        D -->|Yes| F{Status User?}
        F -->|Pending| G[❌ Error: Menunggu approval]
        F -->|Rejected| H[❌ Error: Akun ditolak]
        F -->|Active| I[Get Role Name]
        I --> J[Create Session JWT]
        J --> K[Set Cookie]
        K --> L[✅ Login Berhasil]
    end
    
    subgraph "Session Management"
        M[Request Masuk] --> N{Cookie ada?}
        N -->|No| O[Redirect ke Login]
        N -->|Yes| P[Decrypt JWT]
        P --> Q{Token Valid?}
        Q -->|No| O
        Q -->|Yes| R[Return Session Data]
    end
```

### 2. User Registration & Validation Flow

```mermaid
flowchart TD
    subgraph "Registration"
        A[User Submit Form] --> B[Validasi Input]
        B --> C{Email/NIM unik?}
        C -->|No| D[❌ Error: Sudah terdaftar]
        C -->|Yes| E[Hash Password]
        E --> F[Create User dengan Status=Pending]
        F --> G[✅ Registrasi Berhasil]
    end
    
    subgraph "Admin Validation"
        H[Admin Lihat Pending Users] --> I[Review User Data]
        I --> J{Keputusan}
        J -->|Approve| K[Update Status=Active]
        J -->|Reject| L[Update Status=Rejected]
        K --> M[User Bisa Login]
        L --> N[User Tidak Bisa Login]
    end
```

### 3. Item Loan Flow

```mermaid
flowchart TD
    subgraph "Request Peminjaman"
        A[Mahasiswa Scan QR / Pilih Item] --> B{Item Tersedia?}
        B -->|No| C[❌ Error: Item tidak tersedia]
        B -->|Yes| D[Isi Form Peminjaman]
        D --> E{Ada Surat Izin?}
        E -->|Yes| F[Auto-Approve]
        E -->|No| G[Status = Pending]
        F --> H[Status = Disetujui]
        H --> I[Update Item Status = Dipinjam]
    end
    
    subgraph "Admin Validation"
        G --> J[Admin Review Request]
        J --> K{Keputusan}
        K -->|Approve| H
        K -->|Reject| L[Status = Ditolak]
    end
    
    subgraph "Pengembalian"
        M[Mahasiswa Request Return] --> N{Upload Foto?}
        N -->|Yes| O[Auto-Approve Return]
        N -->|No| P[Return Status = Pending]
        P --> Q[Admin Review]
        Q --> R{Keputusan}
        R -->|Approve| O
        R -->|Reject| S[Return Status = Belum]
        O --> T[Update Return Status = Dikembalikan]
        T --> U[Update Item Status = Tersedia]
        U --> V[Update Loan Status = Selesai]
    end
```

### 4. Room Booking Flow

```mermaid
flowchart TD
    subgraph "Request Booking"
        A[User Pilih Ruangan & Waktu] --> B{Ruangan Tersedia?}
        B -->|No| C[❌ Error: Bentrok jadwal]
        B -->|Yes| D[Isi Form Booking]
        D --> E{Ada Surat Permohonan?}
        E -->|Yes| F[Auto-Approve]
        E -->|No| G[Status = Pending]
        F --> H[Status = Disetujui]
    end
    
    subgraph "Admin Validation"
        G --> I[Admin Review Booking]
        I --> J{Keputusan}
        J -->|Approve| H
        J -->|Reject| K[Status = Ditolak]
    end
    
    subgraph "Calendar View"
        L[User Lihat Kalender] --> M[Ambil Booking Bulan Ini]
        M --> N[Filter by Room]
        N --> O[Display pada Calendar]
    end
```

### 5. Lab Attendance Flow

```mermaid
flowchart TD
    A[User Input NIM] --> B{User Terdaftar?}
    B -->|No| C[❌ Error: NIM tidak terdaftar]
    B -->|Yes| D[Pilih Ruangan]
    D --> E[Pilih/Input Tujuan]
    E --> F{User adalah Dosen?}
    F -->|Yes| G[Skip Dosen Penanggung Jawab]
    F -->|No| H[Input Dosen Penanggung Jawab]
    H --> I{Input Manual?}
    I -->|Yes| J[Gunakan Input]
    I -->|No| K[Gunakan default dari profil]
    G --> L[Create Attendance Record]
    J --> L
    K --> L
    L --> M[✅ Check-in Berhasil]
    M --> N[Tampilkan Detail Absensi]
```

### 6. Publication Flow

```mermaid
flowchart TD
    subgraph "Admin Direct Publish"
        A1[Admin Upload Publikasi] --> B1[Set Status = Published]
        B1 --> C1[Publikasi Live]
    end
    
    subgraph "User Submission"
        A2[User Submit Draft] --> B2[Status = Pending]
        B2 --> C2[Admin Review]
        C2 --> D2{Keputusan}
        D2 -->|Approve| E2[Admin bisa Edit]
        E2 --> F2[Set Status = Published]
        F2 --> C1
        D2 -->|Reject| G2[Status = Rejected]
    end
    
    subgraph "Public View"
        H[Public Akses] --> I[Get Published Only]
        I --> J[Filter by Keyword]
        J --> K[Search by Title/Author]
        K --> L[Display Publications]
        L --> M[View Detail]
        M --> N[Increment View Count]
    end
    
    subgraph "Like System"
        O[User Click Like] --> P{Already Liked?}
        P -->|Yes| Q[Remove Like]
        P -->|No| R[Add Like]
    end
```

### 7. Practicum Module Flow

```mermaid
flowchart TD
    subgraph "Admin/Dosen Upload"
        A[Admin/Dosen Akses] --> B[Create New Module]
        B --> C[Input Nama & Deskripsi]
        C --> D[Upload PDF File]
        D --> E[Pilih Subject Tags]
        E --> F[Save to DB]
    end
    
    subgraph "Student View"
        G[Mahasiswa Akses] --> H[Lihat Daftar Modul]
        H --> I[Filter by Subject]
        I --> J[Search by Name]
        J --> K[View Module Detail]
        K --> L[Download PDF]
    end
    
    subgraph "Update/Delete"
        M[Admin/Dosen Edit] --> N[Update Fields]
        N --> O{New File?}
        O -->|Yes| P[Replace File]
        O -->|No| Q[Keep Existing]
        P --> R[Save Changes]
        Q --> R
        
        S[Admin/Dosen Delete] --> T[Hard Delete]
    end
```

### 8. Governance Document Flow

```mermaid
flowchart TD
    subgraph "Document Upload"
        A[Admin Upload] --> B[Select Type: SOP/LPJ]
        B --> C[Input Title]
        C --> D[Upload PDF File]
        D --> E{Upload Cover?}
        E -->|Yes| F[Upload Cover Image]
        E -->|No| G[Skip Cover]
        F --> H[Save to DB]
        G --> H
    end
    
    subgraph "Public Display"
        I[Homepage] --> J[Get SOP Documents]
        J --> K[Display with Cover]
        K --> L[Click to Download]
    end
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
