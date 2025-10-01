# 🎨 Visual Schema Diagram - Strapi Ponpes

Entity Relationship Diagram dengan detail lengkap untuk sistem manajemen pesantren.

---

## 📊 Complete ERD

```
                                    ┌────────────────────────────────────┐
                                    │          LEMBAGA                   │
                                    │  (Institution/Unit Pendidikan)     │
                                    ├────────────────────────────────────┤
                                    │ • nama: string                     │
                                    │ • slug: string (unique, auto)      │
                                    │ • profilMd: richtext               │
                                    │ • programKerjaMd: richtext         │
                                    │ • frontImages: media[]             │
                                    │ • images, videos, news: component[]│
                                    └───────┬──────────────┬─────────────┘
                                            │              │
                        ┌───────────────────┼──────────────┼───────────────────┐
                        │ oneToMany         │              │ oneToMany         │
                        │ inversedBy:       │              │ inversedBy:       │
                        │ santris           │              │ staffs            │
                        ▼                   │              ▼                   │
        ┌───────────────────────────┐       │      ┌───────────────────────┐  │
        │       SANTRI              │       │      │       STAFF           │  │
        │    (Student Data)         │       │      │  (Teacher/Employee)   │  │
        ├───────────────────────────┤       │      ├───────────────────────┤  │
        │ • nama: string            │       │      │ • nama: string        │  │
        │ • nisn: string (unique)   │       │      │ • nip: string         │  │
        │ • gender: enum[L,P]       │       │      │ • gender: enum[L,P]   │  │
        │ • tempatLahir: string     │       │      │ • kategoriPersonil:   │  │
        │ • tanggalLahir: date      │       │      │   enum[GURU,PENGURUS, │  │
        │ • namaAyah: string        │       │      │   STAFF]              │  │
        │ • namaIbu: string         │       │      │ • aktif: boolean      │  │
        │ • kelurahan, kecamatan,   │       │      │ • keteranganTugas:    │  │
        │   kota: string            │       │      │   text                │  │
        │ • foto: media             │       │      │ • foto: media         │  │
        │ ┌─────────────────────┐   │       │      └───────┬───────────────┘  │
        │ │ 🤖 AUTO-POPULATED   │   │       │              │                  │
        │ │ (by lifecycle)      │   │       │              │ oneToMany        │
        │ ├─────────────────────┤   │       │              │ mappedBy: staff  │
        │ │ • kelasAktif: string│   │       │              ▼                  │
        │ │ • tahunAjaranAktif: │   │       │      ┌──────────────────────┐  │
        │ │   string            │   │       │      │  KEHADIRAN-GURU      │  │
        │ │ • isAlumni: boolean │   │       │      │ (Teacher Attendance) │  │
        │ │ • tahunMasuk: string│   │       │      ├──────────────────────┤  │
        │ │ • tahunLulus: string│   │       │      │ • tanggal: date      │  │
        │ └─────────────────────┘   │       │      │ • jenis: enum[HADIR, │  │
        │ • tahunIjazah: string     │       │      │   SAKIT,IZIN,ALPHA]  │  │
        │ • nomorIjazah: string     │       │      │ • keterangan: text   │  │
        └────┬──────────┬───────────┘       │      └─────┬─────┬──────────┘  │
             │          │                   │            │     │              │
             │          │                   │ oneToMany  │     │ manyToOne    │
             │          │                   │ inversedBy:│     │ inversedBy:  │
             │          │                   │ kelas      │     │ kehadiran_   │
             │          │                   ▼            │     │ guru         │
             │          │          ┌────────────────┐    │     │              │
             │          │          │     KELAS      │◄───┘     │              │
             │          │          │ (Class/Grade)  │          │              │
             │          │          ├────────────────┤          │              │
             │          │          │ • kelas: string│          │              │
             │          │          │   (required)   │          │              │
             │          │          │   e.g. "Kelas 1│          │              │
             │          │          │   ", "Kelas 10 │          │              │
             │          │          │   IPA"         │          │              │
             │          │          └────────┬───────┘          │              │
             │          │                   │                  │              │
             │          │ oneToMany         │ oneToMany        │              │
             │          │ mappedBy:         │ mappedBy:        │              │
             │          │ santri            │ kelas            │              │
             │          │                   │                  │              │
             │          │                   │                  │              │
             │          ▼                   ▼                  │              │
             │  ┌───────────────────────────────────┐          │              │
             │  │      RIWAYAT-KELAS                │          │              │
             │  │   (Class Enrollment History)      │          │              │
             │  │  🎯 SOURCE OF TRUTH for santri    │          │              │
             │  │     current class position        │          │              │
             │  ├───────────────────────────────────┤          │              │
             │  │ • statusSantri: enum[AKTIF,       │          │              │
             │  │   NAIK_KELAS,PINDAH,KELUAR,LULUS] │          │              │
             │  │ • tanggalMulai: date              │          │              │
             │  │ • tanggalSelesai: date (nullable) │          │              │
             │  │ • catatan: text                   │          │              │
             │  │ ┌───────────────────────────────┐ │          │              │
             │  │ │ 🔄 LIFECYCLE TRIGGERS:        │ │          │              │
             │  │ │ afterCreate → update santri   │ │          │              │
             │  │ │   kelasAktif, tahunAjaranAktif│ │          │              │
             │  │ │ afterUpdate (LULUS) → update  │ │          │              │
             │  │ │   isAlumni, tahunLulus        │ │          │              │
             │  │ └───────────────────────────────┘ │          │              │
             │  └────┬──────────────────────────────┘          │              │
             │       │                                         │              │
             │       │ oneToMany                               │              │
             │       │ mappedBy: riwayatKelas                  │              │
             │       │                                         │              │
             │       ▼                                         │              │
             │  ┌────────────────────────┐                    │              │
             │  │  KEHADIRAN-SANTRI      │                    │              │
             │  │ (Student Attendance)   │                    │              │
             │  ├────────────────────────┤                    │              │
             │  │ • tanggal: date        │                    │              │
             │  │ • jenis: enum[HADIR,   │                    │              │
             │  │   SAKIT,IZIN,ALPHA]    │                    │              │
             │  │ • keterangan: text     │                    │              │
             │  └────────────────────────┘                    │              │
             │                                                │              │
             ├────────────────────────────────────────────────┘              │
             │ oneToMany                                                     │
             │ mappedBy: santri                                              │
             │                                                               │
             ├───────────────────┬───────────────────┐                       │
             │                   │                   │                       │
             ▼                   ▼                   ▼                       │
    ┌──────────────────┐ ┌──────────────────┐ ┌───────────────────────┐    │
    │    PRESTASI      │ │   PELANGGARAN    │ │  TAHUN-AJARAN         │    │
    │ (Achievement)    │ │   (Violation)    │ │ (Academic Year)       │    │
    ├──────────────────┤ ├──────────────────┤ ├───────────────────────┤    │
    │ • namaLomba:     │ │ • jenis: string  │ │ • tahunAjaran: string │    │
    │   string         │ │ • poin: integer  │ │   (regex: ^\d{4}/\d{4│    │
    │ • penyelenggara: │ │ • tanggal: date  │ │   $) e.g. "2024/2025" │    │
    │   string         │ │ • keterangan:    │ │ • semester: enum[Ganji│    │
    │ • tingkat: enum  │ │   text           │ │   l,Genap]            │    │
    │   [Sekolah,      │ │                  │ │ • aktif: boolean      │◄───┘
    │   Kecamatan,     │ │                  │ │   (default: false)    │
    │   Kabupaten/Kota,│ │                  │ │ 🎯 ONLY 1 CAN BE     │
    │   Provinsi,      │ │                  │ │    ACTIVE AT A TIME   │
    │   Nasional,      │ │                  │ │ ┌───────────────────┐ │
    │   Internasional] │ │                  │ │ │ 🔄 LIFECYCLE      │ │
    │ • peringkat: enum│ │                  │ │ │ TRIGGERS:         │ │
    │   [Juara 1,2,3,  │ │                  │ │ │ afterUpdate →     │ │
    │   Harapan 1,2,3] │ │                  │ │ │   clear santri    │ │
    │ • bidang: string │ │                  │ │ │   tahunAjaranAktif│ │
    │ • tahun: string  │ │                  │ │ │ beforeDelete →    │ │
    │                  │ │                  │ │ │   prevent if used │ │
    └──────────────────┘ └──────────────────┘ │ └───────────────────┘ │
                                              └───────┬───────────────┘
                                                      │
                                                      │ oneToMany
                                                      │ mappedBy:
                                                      │ tahunAjaran
                                                      │
                                    ┌─────────────────┴─────────────────────┐
                                    │                                       │
                                    │ (connects to RIWAYAT-KELAS above)     │
                                    │ (connects to KEHADIRAN-GURU above)    │
                                    └───────────────────────────────────────┘
```

---

## 🔑 Legend

| Symbol | Meaning |
|--------|---------|
| `•` | Regular field |
| `🤖` | Auto-populated by lifecycle (READ-ONLY) |
| `🔄` | Has lifecycle hooks |
| `🎯` | Important constraint/behavior |
| `─►` | One-to-many relation |
| `◄─` | Many-to-one relation |
| `(unique)` | Must be unique in database |
| `enum[]` | Enumeration with allowed values |

---

## 🎨 Color-Coded Entity Groups

### 🟦 Core Master Data
- **LEMBAGA** - Root entity
- **KELAS** - Class/grade levels
- **TAHUN-AJARAN** - Academic years

### 🟩 People Data
- **SANTRI** - Students
- **STAFF** - Teachers/Employees

### 🟨 Historical/Tracking Data
- **RIWAYAT-KELAS** - Enrollment history (source of truth)
- **KEHADIRAN-GURU** - Teacher attendance
- **KEHADIRAN-SANTRI** - Student attendance

### 🟧 Additional Data
- **PRESTASI** - Achievements
- **PELANGGARAN** - Violations

---

## 🔄 Data Flow: Input Santri

```
┌─────────────────────────────────────────────────────────────────┐
│                    INPUT SANTRI WORKFLOW                        │
└─────────────────────────────────────────────────────────────────┘

Step 1: Prerequisites Exist
────────────────────────────
    ✓ LEMBAGA created
    ✓ TAHUN-AJARAN created (aktif: true)
    ✓ KELAS created

Step 2: Create SANTRI
────────────────────────────
POST /api/santris
{
  nama: "Ahmad Zaki",
  nisn: "0123456789",
  lembaga: 1,                    ← Link to LEMBAGA
  gender: "L",
  tempatLahir: "Surabaya",
  ...
}
↓
Response: { id: 15, ... }        ← Get santri ID

Step 3: Create RIWAYAT-KELAS (Enrollment)
────────────────────────────────────────────
POST /api/riwayat-kelass
{
  santri: 15,                    ← From Step 2
  kelas: 3,                      ← Link to KELAS
  tahunAjaran: 2,                ← Link to TAHUN-AJARAN
  statusSantri: "AKTIF",
  tanggalMulai: "2024-07-15"
}
↓
🔄 LIFECYCLE TRIGGERED: afterCreate
↓
1. Extract kelasId (3) and tahunAjaranId (2) from params
2. Query KELAS id=3 → get "Kelas 1"
3. Query TAHUN-AJARAN id=2 → get "2024/2025"
4. Update SANTRI id=15:
   kelasAktif = "Kelas 1"        ← AUTO!
   tahunAjaranAktif = "2024/2025" ← AUTO!
   tahunMasuk = "2024"           ← AUTO! (if not set)
↓
Step 4: Verify
──────────────
GET /api/santris/15
{
  id: 15,
  nama: "Ahmad Zaki",
  kelasAktif: "Kelas 1",         ✅ AUTO-POPULATED
  tahunAjaranAktif: "2024/2025", ✅ AUTO-POPULATED
  isAlumni: false,
  tahunMasuk: "2024",            ✅ AUTO-POPULATED
  ...
}
```

---

## 🔄 Data Flow: Santri Naik Kelas

```
┌─────────────────────────────────────────────────────────────────┐
│                 SANTRI NAIK KELAS WORKFLOW                      │
└─────────────────────────────────────────────────────────────────┘

Current State:
──────────────
SANTRI id=15
  kelasAktif: "Kelas 1"
  tahunAjaranAktif: "2024/2025"

RIWAYAT-KELAS id=5
  santri: 15
  kelas: 3 (Kelas 1)
  tahunAjaran: 2 (2024/2025)
  statusSantri: "AKTIF"

Step 1: Close Current Enrollment
─────────────────────────────────
PUT /api/riwayat-kelass/5
{
  statusSantri: "NAIK_KELAS",    ← Mark as completed
  tanggalSelesai: "2025-06-30"
}

Step 2: Create New Enrollment (Next Year)
──────────────────────────────────────────
POST /api/riwayat-kelass
{
  santri: 15,
  kelas: 4,                       ← Kelas 2 (new class)
  tahunAjaran: 3,                 ← 2025/2026 (new year)
  statusSantri: "AKTIF",
  tanggalMulai: "2025-07-15"
}
↓
🔄 LIFECYCLE TRIGGERED: afterCreate
↓
1. Query KELAS id=4 → get "Kelas 2"
2. Query TAHUN-AJARAN id=3 → get "2025/2026"
3. Update SANTRI id=15:
   kelasAktif = "Kelas 2"         ← UPDATED!
   tahunAjaranAktif = "2025/2026" ← UPDATED!
↓
New State:
──────────
SANTRI id=15
  kelasAktif: "Kelas 2"           ✅ AUTO-UPDATED
  tahunAjaranAktif: "2025/2026"   ✅ AUTO-UPDATED

RIWAYAT-KELAS (2 entries now):
  [1] id=5: Kelas 1, 2024/2025, NAIK_KELAS ← History
  [2] id=10: Kelas 2, 2025/2026, AKTIF     ← Current
```

---

## 🔄 Data Flow: Santri Lulus (Alumni)

```
┌─────────────────────────────────────────────────────────────────┐
│                   SANTRI LULUS WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

Current State:
──────────────
SANTRI id=15
  kelasAktif: "Kelas 6"
  tahunAjaranAktif: "2029/2030"
  isAlumni: false

RIWAYAT-KELAS id=25
  santri: 15
  kelas: 10 (Kelas 6)
  tahunAjaran: 8 (2029/2030)
  statusSantri: "AKTIF"

Step 1: Mark as LULUS
──────────────────────
PUT /api/riwayat-kelass/25
{
  statusSantri: "LULUS",          ← Change to LULUS
  tanggalSelesai: "2030-06-30"
}
↓
🔄 LIFECYCLE TRIGGERED: afterUpdate
↓
1. Detect statusSantri === "LULUS"
2. Get tahunAjaranId (8)
3. Query TAHUN-AJARAN id=8 → get "2029/2030"
4. Extract tahunLulus from "2029/2030" → "2030"
5. Update SANTRI id=15:
   isAlumni = true                ← AUTO!
   tahunLulus = "2030"            ← AUTO!
↓
New State:
──────────
SANTRI id=15
  kelasAktif: "Kelas 6"
  tahunAjaranAktif: "2029/2030"
  isAlumni: true                  ✅ AUTO-SET
  tahunLulus: "2030"              ✅ AUTO-SET

Now appears in alumni queries! 🎓
```

---

## 🎯 Key Relationships Explained

### 1. LEMBAGA ↔ SANTRI/STAFF/KELAS
```
LEMBAGA (1) ──► (many) SANTRI
LEMBAGA (1) ──► (many) STAFF
LEMBAGA (1) ──► (many) KELAS
```
**Purpose**: Multi-institution support, data isolation per lembaga

---

### 2. SANTRI ↔ RIWAYAT-KELAS ↔ KELAS
```
SANTRI (1) ──► (many) RIWAYAT-KELAS ◄── (many) KELAS (1)
```
**Purpose**: Historical tracking, santri bisa naik kelas tiap tahun

**Why not direct SANTRI ↔ KELAS?**
- Need to track enrollment history
- One santri can have multiple classes over time
- RIWAYAT-KELAS is the "source of truth"

---

### 3. KEHADIRAN-GURU: STAFF + KELAS + TAHUN-AJARAN
```
KEHADIRAN-GURU
  ├─► STAFF (teacher)
  ├─► KELAS (which class)
  └─► TAHUN-AJARAN (which academic year)
```
**Purpose**: Track teacher attendance per class per year

**Why not RIWAYAT-KELAS?**
- Teachers teach multiple classes
- Not tied to specific student enrollment

---

### 4. KEHADIRAN-SANTRI: SANTRI + RIWAYAT-KELAS
```
KEHADIRAN-SANTRI
  ├─► SANTRI (which student)
  └─► RIWAYAT-KELAS (which enrollment period)
```
**Purpose**: Track student attendance per enrollment period

**Why RIWAYAT-KELAS?**
- Attendance tied to enrollment period
- Historical accuracy when student changes class

---

### 5. TAHUN-AJARAN: Single Active Year
```
TAHUN-AJARAN (aktif: true)  ← ONLY ONE!
  ├─► (many) RIWAYAT-KELAS
  └─► (many) KEHADIRAN-GURU
```
**Purpose**: System-wide active academic year

**Lifecycle Protection**:
- ✅ Auto-deactivate others when one is activated
- ✅ Prevent delete if still in use
- ✅ Clear santri.tahunAjaranAktif when deactivated

---

## 📝 Summary

This diagram shows:
- ✅ 10 main entities with complete field definitions
- ✅ All relationships with cardinality
- ✅ Auto-populated fields marked with 🤖
- ✅ Lifecycle triggers marked with 🔄
- ✅ Complete data flows for common operations
- ✅ Visual explanation of key design decisions

Use this as a reference when:
- 🔧 Developing backend APIs
- 🎨 Building frontend forms
- 📊 Writing database queries
- 🐛 Debugging data issues
- 📚 Onboarding new developers

---

**See Also**:
- [SCHEMA_RELATIONSHIPS.md](./SCHEMA_RELATIONSHIPS.md) - Detailed text documentation
- [API_QUERY_EXAMPLES.md](./API_QUERY_EXAMPLES.md) - Query patterns
- [DATA_INPUT_WORKFLOW.md](./DATA_INPUT_WORKFLOW.md) - Step-by-step guides
