# Data Flow Diagram (DFD)

Dokumentasi DFD untuk sistem Laboratorium Informatika UAI.

---

## 🔴 SISTEM LAMA (Manual/Spreadsheet)

### DFD Level 0 - Context Diagram (Sistem Lama)

```mermaid
graph LR
    M[Mahasiswa]
    A[Admin/Laboran]
    K[Kaprodi/PJLAB]
    
    subgraph Sistem_Lama [Sistem Pencatatan Manual]
        P0((0.0<br>Sistem Pencatatan<br>Berbasis Spreadsheet))
    end

    %% Aliran Mahasiswa
    M -- Input Data & Upload Surat --> P0
    
    %% Aliran Admin (Critical Bottleneck)
    P0 -- Rekapan Data Spreadsheet --> A
    A -- Update Status Manual --> P0
    
    %% Aliran Pelaporan (Manual Total)
    A -- Laporan LPJ Bulanan --> K
```

### DFD Level 1 - Process Breakdown (Sistem Lama)

```mermaid
graph TD
    %% Entities
    M[Mahasiswa]
    A[Admin]
    K[Kaprodi/PJLAB]

    %% Data Store
    D1[(D1: Spreadsheet)]

    %% Processes
    P1((1.0<br>Pengisian Formulir))
    P2((2.0<br>Pengecekan &<br>Penjadwalan Manual))
    P3((3.0<br>Pembuatan Laporan))

    %% Flows
    M -->|Data Diri, Layanan, Surat| P1
    P1 -->|Data Transaksi| D1
    
    D1 -.->|Baca Data Mentah| P2
    P2 <-- Intervensi Manual --> A
    P2 -.->|Konfirmasi Manual| M
    
    D1 -.->|Ambil Data Mentah| P3
    P3 <-- Rekap Manual --> A
    P3 -->|Dokumen LPJ| K

    %% Styling untuk menekankan proses manual
    style P2 stroke:#f00,stroke-width:2px,stroke-dasharray: 5 5
    style P3 stroke:#f00,stroke-width:2px,stroke-dasharray: 5 5
```

---

## 🟢 SISTEM BARU (LAB_UAI Web Application)

### DFD Level 0 - Context Diagram

```mermaid
graph LR
    M[Mahasiswa]
    D[Dosen]
    A[Admin]

    subgraph Sistem_Baru [LAB_UAI Web System]
        P0((0.0<br>Sistem Informasi<br>Laboratorium))
    end

    M -- Registrasi, Peminjaman, Booking, Absensi --> P0
    D -- Kelola Modul, Publikasi --> P0
    P0 -- Notifikasi Status --> M
    P0 -- Notifikasi Status --> D
    A -- Validasi, Kelola Data --> P0
    P0 -- Dashboard & Laporan --> A
```

---

### DFD Level 1 - Process Breakdown

```mermaid
graph TD
    %% Entities
    User[User: Mhs/Dosen/Admin]
    M[Mahasiswa]
    A[Admin]

    %% Data Stores
    DS1[(D1: Items)]
    DS2[(D2: Loans)]
    DS3[(D3: Bookings)]
    DS4[(D4: Attendance)]

    %% Processes
    P1((1.0<br>Autentikasi))
    P2((2.0<br>Manajemen<br>Inventaris))
    P3((3.0<br>Transaksi<br>Peminjaman))
    P4((4.0<br>Booking<br>Ruangan))
    P5((5.0<br>Smart<br>Reporting))

    %% Flow 1.0 Auth
    User -->|Login/Register| P1
    P1 -->|Session Akses| User
    A -->|Validasi User| P1

    %% Flow 2.0 Inventaris
    A -->|Input Alat / Gen QR| P2
    P2 -->|Simpan Data Alat| DS1
    M -->|Scan QR / View| P2
    P2 -->|Info Item| M

    %% Flow 3.0 Loans (Inti Sistem)
    M -->|Scan QR / Request| P3
    P3 -->|Cek Stok| DS1
    DS1 -->|Info Stok| P3
    A -->|Approve/Reject| P3
    P3 -->|Update Status Item| DS1
    P3 -->|Simpan Transaksi| DS2
    P3 -->|Status Peminjaman| M

    %% Flow 4.0 Booking Ruangan
    M -->|Request Booking| P4
    P4 -->|Cek Availability| DS3
    A -->|Approve/Reject| P4
    P4 -->|Simpan Booking| DS3
    P4 -->|Status Booking| M

    %% Flow 5.0 Reporting (Automated)
    DS1 -->|Query Data| P5
    DS2 -->|Query Loans| P5
    DS3 -->|Query Bookings| P5
    DS4 -->|Query Attendance| P5
    P5 -->|Dashboard & Statistik| A
```

---

### DFD Level 2 - Detail Per Proses

#### 2.1 Authentication (P1)

```mermaid
graph LR
    M[User] -->|Email, Password| P1.1((1.1<br>Login))
    P1.1 -->|Validate| DB[(Users)]
    P1.1 -->|JWT Token| M
    
    M -->|Form Data| P1.2((1.2<br>Register))
    P1.2 -->|Insert Pending| DB
    
    A[Admin] -->|Approve/Reject| P1.3((1.3<br>Validate))
    P1.3 -->|Update Status| DB
```

---

#### 2.2 Inventory Management (P2)

```mermaid
graph LR
    A[Admin] -->|Create/Update| P2.1((2.1<br>Manage Items))
    P2.1 <-->|R/W| DB[(Items)]
    
    A -->|Create/Update| P2.2((2.2<br>Manage Rooms))
    P2.2 <-->|R/W| DB2[(Rooms)]
    
    A -->|Create/Update| P2.3((2.3<br>Manage Categories))
    P2.3 <-->|R/W| DB3[(Categories)]
    
    U[User] -->|Scan QR| P2.4((2.4<br>View Item))
    P2.4 -->|Read| DB
```

---

#### 2.3 Item Loan (P3)

```mermaid
graph LR
    M[Mahasiswa] -->|Request| P3.1((3.1<br>Create Loan))
    P3.1 -->|Insert| DB[(Loans)]
    P3.1 -->|Check| DB2[(Items)]
    
    A[Admin] -->|Approve/Reject| P3.2((3.2<br>Validate Loan))
    P3.2 -->|Update Status| DB
    P3.2 -->|Update Item Status| DB2
    
    M -->|Return Request| P3.3((3.3<br>Return Item))
    P3.3 -->|Update| DB
    A -->|Confirm Return| P3.3
    P3.3 -->|Reset Item Status| DB2
```

---

#### 2.4 Room Booking (P4)

```mermaid
graph LR
    U[User] -->|Request| P4.1((4.1<br>Create Booking))
    P4.1 -->|Check Availability| DB[(Bookings)]
    P4.1 -->|Insert| DB
    
    A[Admin] -->|Approve/Reject| P4.2((4.2<br>Validate))
    P4.2 -->|Update Status| DB
    
    U -->|View Calendar| P4.3((4.3<br>Calendar))
    P4.3 -->|Read| DB
```

---

#### 2.5 Lab Attendance (P5)

```mermaid
graph LR
    U[User] -->|NIM + Room + Purpose| P5.1((5.1<br>Check-in))
    P5.1 -->|Validate NIM| DB[(Users)]
    P5.1 -->|Insert Record| DB2[(Attendance)]
    P5.1 -->|Confirmation| U
```

---

#### 2.6 Publications (P6)

```mermaid
graph LR
    U[User] -->|Submit Draft| P6.1((6.1<br>Submit))
    P6.1 -->|Insert Pending| DB[(Publications)]
    
    A[Admin] -->|Approve/Edit/Reject| P6.2((6.2<br>Review))
    P6.2 -->|Update Status| DB
    
    P[Public] -->|Search/Filter| P6.3((6.3<br>View))
    P6.3 -->|Read Published| DB
    
    U -->|Like/Unlike| P6.4((6.4<br>Like))
    P6.4 <-->|R/W| DB2[(Likes)]
```

---

#### 2.7 Practicum Modules (P7)

```mermaid
graph LR
    AD[Admin/Dosen] -->|Upload| P7.1((7.1<br>Create Module))
    P7.1 -->|Insert| DB[(Modules)]
    
    AD -->|Edit/Delete| P7.2((7.2<br>Manage))
    P7.2 <-->|R/W| DB
    
    M[Mahasiswa] -->|Search/Filter| P7.3((7.3<br>Browse))
    P7.3 -->|Read| DB
    M -->|Download PDF| P7.3
```

---

#### 2.8 Governance Documents (P8)

```mermaid
graph LR
    A[Admin] -->|Upload| P8.1((8.1<br>Upload Doc))
    P8.1 -->|Insert| DB[(Governance)]
    
    A -->|Edit/Delete| P8.2((8.2<br>Manage))
    P8.2 <-->|R/W| DB
    
    P[Public] -->|View/Download| P8.3((8.3<br>Display))
    P8.3 -->|Read| DB
```

---

## Perbandingan Sistem Lama vs Baru

| Aspek | Sistem Lama | Sistem Baru (LAB_UAI) |
|-------|-------------|----------------------|
| **Penyimpanan** | Spreadsheet | MySQL Database |
| **Akses** | Offline/File Share | Web-based (Online) |
| **Validasi** | Manual Admin | Semi-Auto (dengan surat) |
| **Laporan** | Manual Rekap | Dashboard Otomatis |
| **Notifikasi** | Tidak Ada | Real-time Status |
| **User Roles** | Tidak Ada | Admin, Dosen, Mahasiswa |
| **Peminjaman** | Paper-based | QR Code Scan |
| **Booking** | Manual Check | Calendar + Auto Check |
| **Publikasi** | Tidak Ada | Submit & Review System |
