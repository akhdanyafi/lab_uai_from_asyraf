# Class Diagram — Sistem Manajemen Laboratorium UAI

Dokumentasi class diagram menggunakan PlantUML untuk menggambarkan struktur entitas, atribut, dan relasi antar kelas dalam sistem.

---

## Class Diagram Lengkap (Semua Entitas)

```plantuml
@startuml class-diagram-full

skinparam classAttributeIconSize 0
skinparam classFontSize 12
skinparam classFontStyle bold
skinparam packageFontSize 14
skinparam packageStyle rectangle
skinparam linetype ortho

' ============================================
' PACKAGE: Core
' ============================================
package "Core" #E8F5E9 {

    class Role {
        +id : int <<PK>>
        +name : varchar(50) <<UNIQUE>>
    }

    class User {
        +id : int <<PK>>
        +role_id : int <<FK>>
        +full_name : varchar(255)
        +identifier : varchar(50) <<UNIQUE>>
        +email : varchar(255)
        +password_hash : varchar(255)
        +status : enum {Active, Pending, Rejected, Pre-registered}
        +batch : int
        +study_type : enum {Reguler, Hybrid}
        +program_studi : varchar(100)
        +dosen_pembimbing : varchar(255)
        +created_at : datetime
    }
}

' ============================================
' PACKAGE: Inventory
' ============================================
package "Inventory" #E3F2FD {

    class Room {
        +id : int <<PK>>
        +name : varchar(100)
        +location : varchar(255)
        +capacity : int
        +status : enum {Tersedia, Maintenance}
    }

    class ItemCategory {
        +id : int <<PK>>
        +name : varchar(100)
    }

    class Item {
        +id : int <<PK>>
        +category_id : int <<FK>>
        +room_id : int <<FK>>
        +name : varchar(255)
        +description : text
        +qr_code : varchar(255) <<UNIQUE>>
        +status : enum {Tersedia, Dipinjam, Maintenance}
    }
}

' ============================================
' PACKAGE: Transactions
' ============================================
package "Transactions" #FFF3E0 {

    class ItemLoan {
        +id : int <<PK>>
        +student_id : int <<FK>>
        +item_id : int <<FK>>
        +validator_id : int <<FK>>
        +request_date : datetime
        +return_plan_date : datetime
        +actual_return_date : datetime
        +status : enum {Pending, Disetujui, Ditolak, Selesai, Terlambat}
        +organisasi : varchar(255)
        +start_time : datetime
        +end_time : datetime
        +purpose : varchar(255)
        +surat_izin : varchar(255)
        +dosen_pembimbing : varchar(255)
        +software : text
        +notification_read : enum {'0', '1'}
        +return_photo : varchar(255)
        +return_status : enum {Belum, Pending, Dikembalikan}
        +return_notification_read : enum {'0', '1'}
    }

    class RoomBooking {
        +id : int <<PK>>
        +user_id : int <<FK>>
        +room_id : int <<FK>>
        +validator_id : int <<FK>>
        +start_time : datetime
        +end_time : datetime
        +purpose : text
        +organisasi : varchar(255)
        +jumlah_peserta : int
        +surat_permohonan : varchar(255)
        +dosen_pembimbing : varchar(255)
        +status : enum {Pending, Disetujui, Ditolak}
        +notification_read : enum {'0', '1'}
    }

    class LabAttendance {
        +id : int <<PK>>
        +user_id : int <<FK>>
        +room_id : int <<FK>>
        +purpose : varchar(255)
        +dosen_penanggung_jawab : varchar(255)
        +check_in_time : datetime
    }
}

' ============================================
' PACKAGE: Academic
' ============================================
package "Academic" #F3E5F5 {

    class Course {
        +id : int <<PK>>
        +code : varchar(20) <<UNIQUE>>
        +name : varchar(255)
        +description : text
        +sks : int
        +semester : varchar(50)
        +lecturer_id : int <<FK>>
        +created_at : datetime
    }

    class PracticumModule {
        +id : int <<PK>>
        +course_id : int <<FK>>
        +name : varchar(255)
        +description : text
        +file_path : varchar(255)
        +created_at : datetime
        +updated_at : datetime
    }

    class ScheduledPracticum {
        +id : int <<PK>>
        +course_id : int <<FK>>
        +room_id : int <<FK>>
        +module_id : int <<FK>>
        +created_by : int <<FK>>
        +semester : varchar(50)
        +day_of_week : int
        +start_time : varchar(5)
        +end_time : varchar(5)
        +scheduled_date : datetime
        +status : enum {Aktif, Dibatalkan}
        +created_at : datetime
    }
}

' ============================================
' PACKAGE: Content Management
' ============================================
package "Content Management" #FCE4EC {

    class GovernanceDoc {
        +id : int <<PK>>
        +admin_id : int <<FK>>
        +title : varchar(255)
        +file_path : varchar(255)
        +cover_path : varchar(255)
        +type : enum {SOP, LPJ Bulanan}
        +created_at : datetime
    }

    class Publication {
        +id : int <<PK>>
        +uploader_id : int <<FK>>
        +submitter_id : int <<FK>>
        +author_name : varchar(255)
        +title : varchar(255)
        +abstract : text
        +keywords : text
        +file_path : varchar(255)
        +link : varchar(255)
        +view_count : int
        +status : enum {Pending, Published, Rejected}
        +publish_date : datetime
        +created_at : datetime
    }

    class PublicationLike {
        +id : int <<PK>>
        +publication_id : int <<FK>>
        +user_id : int <<FK>>
        +created_at : datetime
    }

    class HeroPhoto {
        +id : int <<PK>>
        +title : varchar(255)
        +description : text
        +image_url : text
        +link : text
        +created_at : datetime
    }
}

' ============================================
' RELATIONSHIPS
' ============================================

' Core
Role "1" -- "0..*" User : memiliki >

' Inventory
ItemCategory "1" -- "0..*" Item : mengkategorikan >
Room "1" -- "0..*" Item : menyimpan >

' Transactions
User "1" -- "0..*" ItemLoan : mengajukan (student) >
User "1" -- "0..*" ItemLoan : memvalidasi (admin) >
Item "1" -- "0..*" ItemLoan : dipinjam >

User "1" -- "0..*" RoomBooking : memesan >
User "1" -- "0..*" RoomBooking : memvalidasi (admin) >
Room "1" -- "0..*" RoomBooking : digunakan >

User "1" -- "0..*" LabAttendance : check-in >
Room "1" -- "0..*" LabAttendance : dimasuki >

' Academic
User "1" -- "0..*" Course : mengajar (dosen) >
Course "1" -- "0..*" PracticumModule : memiliki modul >
Course "1" -- "0..*" ScheduledPracticum : dijadwalkan >
Room "1" -- "0..*" ScheduledPracticum : digunakan >
PracticumModule "0..1" -- "0..*" ScheduledPracticum : dijalankan >
User "1" -- "0..*" ScheduledPracticum : membuat (kepalalab) >

' Content Management
User "1" -- "0..*" GovernanceDoc : mengunggah (admin) >
User "1" -- "0..*" Publication : mempublikasi (uploader) >
User "1" -- "0..*" Publication : mengirim (submitter) >
Publication "1" -- "0..*" PublicationLike : menerima >
User "1" -- "0..*" PublicationLike : memberi like >

@enduml
```

---

## Class Diagram per Domain

Diagram dipecah per domain agar lebih mudah dibaca dan di-screenshot.

### 1. Core — Users & Roles

```plantuml
@startuml class-core

skinparam classAttributeIconSize 0
skinparam linetype ortho

class Role {
    +id : int <<PK>>
    +name : varchar(50) <<UNIQUE>>
    --
    Nilai: Admin, Mahasiswa, Dosen,
    Kaprodi, Kepala Laboratorium
}

class User {
    +id : int <<PK>>
    +role_id : int <<FK>>
    +full_name : varchar(255)
    +identifier : varchar(50) <<UNIQUE>>
    +email : varchar(255)
    +password_hash : varchar(255)
    +status : enum
    +batch : int
    +study_type : enum
    +program_studi : varchar(100)
    +dosen_pembimbing : varchar(255)
    +created_at : datetime
    --
    Status: Active | Pending | Rejected | Pre-registered
    StudyType: Reguler | Hybrid
}

Role "1" -- "0..*" User : memiliki >

@enduml
```

### 2. Inventory — Items, Categories & Rooms

```plantuml
@startuml class-inventory

skinparam classAttributeIconSize 0
skinparam linetype ortho

class Room {
    +id : int <<PK>>
    +name : varchar(100)
    +location : varchar(255)
    +capacity : int
    +status : enum {Tersedia, Maintenance}
}

class ItemCategory {
    +id : int <<PK>>
    +name : varchar(100)
}

class Item {
    +id : int <<PK>>
    +category_id : int <<FK>>
    +room_id : int <<FK>>
    +name : varchar(255)
    +description : text
    +qr_code : varchar(255) <<UNIQUE>>
    +status : enum {Tersedia, Dipinjam, Maintenance}
}

ItemCategory "1" -- "0..*" Item : mengkategorikan >
Room "1" -- "0..*" Item : menyimpan >

@enduml
```

### 3. Transactions — Loans, Bookings & Attendance

```plantuml
@startuml class-transactions

skinparam classAttributeIconSize 0
skinparam linetype ortho

class User {
    +id : int <<PK>>
    +full_name : varchar(255)
}

class Item {
    +id : int <<PK>>
    +name : varchar(255)
}

class Room {
    +id : int <<PK>>
    +name : varchar(100)
}

class ItemLoan {
    +id : int <<PK>>
    +student_id : int <<FK>>
    +item_id : int <<FK>>
    +validator_id : int <<FK>>
    +request_date : datetime
    +return_plan_date : datetime
    +actual_return_date : datetime
    +status : enum
    +organisasi : varchar(255)
    +start_time : datetime
    +end_time : datetime
    +purpose : varchar(255)
    +surat_izin : varchar(255)
    +dosen_pembimbing : varchar(255)
    +software : text
    +notification_read : enum {'0','1'}
    +return_photo : varchar(255)
    +return_status : enum
    +return_notification_read : enum {'0','1'}
    --
    Status: Pending | Disetujui | Ditolak | Selesai | Terlambat
    ReturnStatus: Belum | Pending | Dikembalikan
}

class RoomBooking {
    +id : int <<PK>>
    +user_id : int <<FK>>
    +room_id : int <<FK>>
    +validator_id : int <<FK>>
    +start_time : datetime
    +end_time : datetime
    +purpose : text
    +organisasi : varchar(255)
    +jumlah_peserta : int
    +surat_permohonan : varchar(255)
    +dosen_pembimbing : varchar(255)
    +status : enum {Pending, Disetujui, Ditolak}
    +notification_read : enum {'0','1'}
}

class LabAttendance {
    +id : int <<PK>>
    +user_id : int <<FK>>
    +room_id : int <<FK>>
    +purpose : varchar(255)
    +dosen_penanggung_jawab : varchar(255)
    +check_in_time : datetime
}

User "1" -- "0..*" ItemLoan : student >
User "1" -- "0..*" ItemLoan : validator >
Item "1" -- "0..*" ItemLoan : dipinjam >

User "1" -- "0..*" RoomBooking : user >
User "1" -- "0..*" RoomBooking : validator >
Room "1" -- "0..*" RoomBooking : digunakan >

User "1" -- "0..*" LabAttendance : check-in >
Room "1" -- "0..*" LabAttendance : dimasuki >

@enduml
```

### 4. Academic — Courses, Modules & Schedules

```plantuml
@startuml class-academic

skinparam classAttributeIconSize 0
skinparam linetype ortho

class User {
    +id : int <<PK>>
    +full_name : varchar(255)
}

class Room {
    +id : int <<PK>>
    +name : varchar(100)
}

class Course {
    +id : int <<PK>>
    +code : varchar(20) <<UNIQUE>>
    +name : varchar(255)
    +description : text
    +sks : int
    +semester : varchar(50)
    +lecturer_id : int <<FK>>
    +created_at : datetime
}

class PracticumModule {
    +id : int <<PK>>
    +course_id : int <<FK>>
    +name : varchar(255)
    +description : text
    +file_path : varchar(255)
    +created_at : datetime
    +updated_at : datetime
}

class ScheduledPracticum {
    +id : int <<PK>>
    +course_id : int <<FK>>
    +room_id : int <<FK>>
    +module_id : int <<FK>>
    +created_by : int <<FK>>
    +semester : varchar(50)
    +day_of_week : int
    +start_time : varchar(5)
    +end_time : varchar(5)
    +scheduled_date : datetime
    +status : enum {Aktif, Dibatalkan}
    +created_at : datetime
    --
    day_of_week: 0=Senin .. 6=Minggu
}

User "1" -- "0..*" Course : mengajar >
Course "1" -- "0..*" PracticumModule : memiliki >
Course "1" -- "0..*" ScheduledPracticum : dijadwalkan >
Room "1" -- "0..*" ScheduledPracticum : digunakan >
PracticumModule "0..1" -- "0..*" ScheduledPracticum : dijalankan >
User "1" -- "0..*" ScheduledPracticum : membuat >

@enduml
```

### 5. Content Management — Publications, Governance & Hero

```plantuml
@startuml class-content

skinparam classAttributeIconSize 0
skinparam linetype ortho

class User {
    +id : int <<PK>>
    +full_name : varchar(255)
}

class GovernanceDoc {
    +id : int <<PK>>
    +admin_id : int <<FK>>
    +title : varchar(255)
    +file_path : varchar(255)
    +cover_path : varchar(255)
    +type : enum {SOP, LPJ Bulanan}
    +created_at : datetime
}

class Publication {
    +id : int <<PK>>
    +uploader_id : int <<FK>>
    +submitter_id : int <<FK>>
    +author_name : varchar(255)
    +title : varchar(255)
    +abstract : text
    +keywords : text
    +file_path : varchar(255)
    +link : varchar(255)
    +view_count : int
    +status : enum {Pending, Published, Rejected}
    +publish_date : datetime
    +created_at : datetime
}

class PublicationLike {
    +id : int <<PK>>
    +publication_id : int <<FK>>
    +user_id : int <<FK>>
    +created_at : datetime
}

class HeroPhoto {
    +id : int <<PK>>
    +title : varchar(255)
    +description : text
    +image_url : text
    +link : text
    +created_at : datetime
}

User "1" -- "0..*" GovernanceDoc : mengunggah >
User "1" -- "0..*" Publication : uploader >
User "1" -- "0..*" Publication : submitter >
Publication "1" -- "0..*" PublicationLike : menerima >
User "1" -- "0..*" PublicationLike : memberi like >

note bottom of HeroPhoto
  Standalone entity
  (tidak memiliki relasi FK)
end note

@enduml
```

---

## Cara Render PlantUML

### Online
1. Buka [PlantUML Online Server](https://www.plantuml.com/plantuml/uml/)
2. Copy-paste kode PlantUML di atas
3. Klik "Submit" untuk render diagram

### VS Code Extension
1. Install extension **PlantUML** (`jebbs.plantuml`)
2. Buka file `.puml` atau blok `plantuml` dalam markdown
3. `Alt+D` untuk preview diagram

### Command Line
```bash
# Install PlantUML
# Membutuhkan Java Runtime
java -jar plantuml.jar CLASS_DIAGRAM.md
```
