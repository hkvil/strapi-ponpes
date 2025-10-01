# 🔗 Database Schema & Relationships - Strapi Ponpes

Dokumentasi lengkap struktur database, relasi antar entity, dan lifecycle hooks.

---

## 📊 Entity Relationship Diagram (ERD)

### **Core Entities & Relationships**

```
                                    ┌─────────────────────────────┐
                                    │        LEMBAGA              │
                                    │  (Institution/Unit)         │
                                    │─────────────────────────────│
                                    │ + nama: string              │
                                    │ + slug: string (unique)     │
                                    │ + profilMd: richtext        │
                                    │ + programKerjaMd: richtext  │
                                    │ + frontImages: media[]      │
                                    │ + kontak: component[]       │
                                    └──────────┬──────────────────┘
                                               │
                         ┌─────────────────────┼─────────────────────┐
                         │ oneToMany           │ oneToMany           │ oneToMany
                         │                     │                     │
                         ▼                     ▼                     ▼
              ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
              │     KELAS        │  │     SANTRI       │  │      STAFF       │
              │   (Class)        │  │   (Student)      │  │  (Teacher/Staff) │
              │──────────────────│  │──────────────────│  │──────────────────│
              │ + kelas: string  │  │ + nama: string   │  │ + nama: string   │
              │ + lembaga ───────┼──┤ + nisn: string   │  │ + NIK: string    │
              └────┬─────────────┘  │   (unique)       │  │ + nip: string    │
                   │                │ + gender: L/P    │  │ + gender: L/P    │
                   │                │ + lembaga ───────┼──┤ + lembaga        │
                   │                │                  │  │ + kategori: enum │
                   │                │ * kelasAktif     │  │ + aktif: boolean │
                   │                │ * tahunAjaranAktif│ │ + statusKepegawaian│
                   │                │ * isAlumni       │  │ + pendidikanTerakhir│
                   │                │ * tahunMasuk     │  └────┬─────────────┘
                   │                │ * tahunLulus     │       │
                   │                └────┬─────┬───────┘       │
                   │                     │     │               │
                   │                     │     │oneToMany      │oneToMany
                   │                     │     │               │
                   │                     │     ▼               ▼
                   │                     │  ┌──────────────────────┐
                   │                     │  │     PRESTASI         │
                   │ manyToOne           │  │  (Achievement)       │
                   │                     │  │──────────────────────│
                   ▼                     │  │ + namaLomba: string  │
        ┌──────────────────────┐        │  │ + bidang: string     │
        │   RIWAYAT-KELAS      │        │  │ + tingkat: enum      │
        │  (Class History)     │◄───────┘  │ + peringkat: enum    │
        │──────────────────────│ manyToOne │ + tahun: string      │
        │ + santri ────────────┼──────┐    │ + santri ────────────┼─┐
        │ + kelas ─────────────┼──┐   │    └──────────────────────┘ │
        │ + tahunAjaran ───────┼─┐│   │                              │
        │ + statusSantri: enum │ ││   │    ┌──────────────────────┐ │
        │ + tanggalMulai: date │ ││   │    │    PELANGGARAN       │ │
        │ + tanggalSelesai     │ ││   │    │    (Violation)       │ │
        │ + catatan: text      │ ││   │    │──────────────────────│ │
        └────┬─────────────────┘ ││   │    │ + jenis: string      │ │
             │                   ││   │    │ + poin: integer      │ │
             │oneToMany          ││   │    │ + tanggal: date      │ │
             │                   ││   │    │ + keterangan: text   │ │
             ▼                   ││   │    │ + santri ────────────┼─┘
        ┌──────────────────────┐││   │    └──────────────────────┘
        │  KEHADIRAN-SANTRI    │││   │
        │ (Student Attendance) │││   │    ┌──────────────────────┐
        │──────────────────────│││   └────│  KEHADIRAN-GURU      │
        │ + santri ────────────┼┘│        │ (Teacher Attendance) │
        │ + riwayatKelas ──────┼─┘        │──────────────────────│
        │ + tanggal: date      │          │ + staff ─────────────┼─┐
        │ + jenis: enum        │          │ + kelas ─────────────┼─┼─┐
        │ + keterangan: text   │          │ + tahunAjaran ───────┼┐│ │
        └──────────────────────┘          │ + tanggal: date      │││ │
                                          │ + jenis: enum        │││ │
                                          │ + keterangan: text   │││ │
                                          └──────────────────────┘││ │
                                                                  ││ │
                                          ┌──────────────────────┐││ │
                                          │   TAHUN-AJARAN       │││ │
                                          │  (Academic Year)     │││ │
                                          │──────────────────────│││ │
                                          │ + tahunAjaran: string│││ │
                                          │   (YYYY/YYYY)        ││└─┤
                                          │ + semester: enum     ││  │
                                          │   (GANJIL/GENAP)     │└──┤
                                          │ + aktif: boolean     │   │
                                          │ + label: string      │   │
                                          └──────────────────────┘   │
                                                    ▲                │
                                                    └────────────────┘
```

**Legend**:
- `─►` = One-to-Many Relationship
- `◄─` = Many-to-One Relationship  
- `*` = Auto-populated field (managed by lifecycle, JANGAN EDIT MANUAL)
- `+` = Regular field
- `(unique)` = Unique constraint

---

## 🗂️ Entity Details

### 1. **LEMBAGA** (Institution)

**Purpose**: Unit pendidikan (MI, MTs, MA, Ponpes, dll)

**Attributes**:
```typescript
{
  nama: string;
  slug: string (unique, auto from nama);
  profilMd: richtext;
  programKerjaMd: richtext;
  frontImages: media[];
  images: component[];
  videos: component[];
  news: component[];
  kontak: component[];
  files: component[];
  botBanner: media;
  topBanner: media;
}
```

**Relations**:
- `santris` → oneToMany → Santri
- `staffs` → oneToMany → Staff
- `kelas` → oneToMany → Kelas

**Lifecycle**: None

**Notes**: Root entity, semua data terikat ke lembaga

---

### 2. **SANTRI** (Student)

**Purpose**: Data siswa/santri

**Attributes**:
```typescript
{
  // Identitas Dasar
  nama: string;
  nisn: string (unique);
  gender: enum ['L', 'P'];
  tempatLahir: string;
  tanggalLahir: date;
  foto: media;
  
  // Data Keluarga
  namaAyah: string;
  namaIbu: string;
  
  // Alamat
  kelurahan: string;
  kecamatan: string;
  kota: string;
  
  // Data Akademik
  nomorIjazah: string;
  tahunIjazah: string;
  
  // AUTO-POPULATED (Shortcut fields - JANGAN EDIT MANUAL)
  kelasAktif: string;           // e.g., "Kelas 7A"
  tahunAjaranAktif: string;     // e.g., "2024/2025"
  isAlumni: boolean (default: false);
  tahunMasuk: string;           // e.g., "2024"
  tahunLulus: string;           // e.g., "2027"
}
```

**Relations**:
- `lembaga` → manyToOne → Lembaga (inversedBy: santris)
- `riwayatKelas` → oneToMany → RiwayatKelas (mappedBy: santri)
- `prestasis` → oneToMany → Prestasi (mappedBy: santri)
- `pelanggarans` → oneToMany → Pelanggaran (mappedBy: santri)
- `kehadiran_santri` → oneToMany → KehadiranSantri (mappedBy: santri)

**Lifecycle**: Managed by RiwayatKelas lifecycle

**Notes**: 
- **JANGAN EDIT MANUAL**: `kelasAktif`, `tahunAjaranAktif`, `isAlumni`, `tahunLulus`
- Fields tersebut auto-update dari lifecycle riwayat-kelas
- `nisn` harus unique untuk identifikasi unik santri
- `tahunMasuk` diisi otomatis saat pertama kali create riwayat-kelas

---

### 3. **STAFF** (Teacher/Staff)

**Purpose**: Data guru dan karyawan

**Attributes**:
```typescript
{
  // Identitas Dasar
  nama: string;
  NIK: string;
  nip: string;
  gender: enum ['L', 'P'];
  tempatLahir: string;
  tanggalLahir: date;
  agama: enum ['ISLAM'];
  noTelepon: string;
  namaIbu: string;
  foto: media;
  
  // Data Kepegawaian
  kategoriPersonil: enum ['GURU', 'PENGURUS', 'STAFF'];
  keteranganTugas: text;
  statusKepegawaian: enum ['PNS', 'GTY', 'GTTY', 'HONORER', 'KONTRAK'];
  mulaiTugas: date;
  aktif: boolean;
  statusPNS: boolean;
  statusGuruTetap: boolean;
  
  // Data Pendidikan
  pendidikanTerakhir: enum ['S1', 'S2', 'S3'];
  lulusan: string;
  sertifikasi: text;
}
```

**Relations**:
- `lembaga` → manyToOne → Lembaga (inversedBy: staffs)
- `kehadiran` → oneToMany → KehadiranGuru (mappedBy: staff)

**Lifecycle**: None

**Notes**: 
- Field `aktif` untuk tracking status guru/staff (aktif/non-aktif)
- `NIK` = Nomor Induk Kependudukan (16 digit)
- `nip` = Nomor Induk Pegawai (18 digit)
- `statusKepegawaian` untuk klasifikasi kepegawaian
- `statusPNS` dan `statusGuruTetap` untuk status khusus

---

### 4. **KELAS** (Class)

**Purpose**: Tingkat kelas (Kelas 1, Kelas 2, dll)

**Attributes**:
```typescript
{
  kelas: string (required); // Free text: "Kelas 1", "Kelas 10 IPA", etc.
}
```

**Relations**:
- `lembaga` → manyToOne → Lembaga (inversedBy: kelas)
- `riwayatKelas` → oneToMany → RiwayatKelas (mappedBy: kelas)
- `kehadiran_guru` → oneToMany → KehadiranGuru (mappedBy: kelas)

**Lifecycle**: None

**Notes**: 
- Tidak ada relasi langsung ke Santri
- Santri linked via RiwayatKelas (historical record)

---

### 5. **RIWAYAT-KELAS** (Class History)

**Purpose**: Historical record santri di kelas tertentu (enrollment period)

**Attributes**:
```typescript
{
  statusSantri: enum ['AKTIF', 'LULUS', 'PINDAH', 'CUTI'];
  tanggalMulai: date;
  tanggalSelesai: date (nullable);
  catatan: text;
}
```

**Relations**:
- `santri` → manyToOne → Santri (inversedBy: riwayatKelas)
- `kelas` → manyToOne → Kelas (inversedBy: riwayatKelas)
- `tahunAjaran` → manyToOne → TahunAjaran (inversedBy: riwayatKelas)
- `kehadiran_santri` → oneToMany → KehadiranSantri (mappedBy: riwayatKelas)

**Lifecycle**: 
- ✅ **afterCreate**: Auto-populate `kelasAktif` dan `tahunAjaranAktif` di Santri
- ✅ **afterUpdate**: Saat status jadi "LULUS", set `isAlumni = true` dan `tahunLulus`

**Notes**: 
- **SOURCE OF TRUTH** untuk posisi santri di kelas
- Satu santri bisa punya multiple riwayat (naik kelas tiap tahun)
- `statusSantri` available values: 'AKTIF', 'LULUS', 'PINDAH', 'CUTI'
- Status 'NAIK_KELAS' dan 'KELUAR' sudah dihapus dari enum

---

### 6. **TAHUN-AJARAN** (Academic Year)

**Purpose**: Periode tahun ajaran

**Attributes**:
```typescript
{
  tahunAjaran: string (required, unique: false, regex: ^\d{4}/\d{4}$);
  semester: enum ['GANJIL', 'GENAP'] (required);
  aktif: boolean (required, default: false);
  label: string;
}
```

**Relations**:
- `riwayatKelas` → oneToMany → RiwayatKelas (mappedBy: tahunAjaran)
- `kehadiran_guru` → oneToMany → KehadiranGuru (mappedBy: tahunAjaran)

**Lifecycle**:
- ✅ **afterUpdate**: Saat tahun ajaran di-non-aktifkan, clear `tahunAjaranAktif` di semua Santri
- ✅ **beforeDelete**: Cegah delete jika masih ada RiwayatKelas yang terkait

**Notes**: 
- **HANYA 1 tahun ajaran aktif** di satu waktu (per kombinasi tahunAjaran + semester)
- Format tahunAjaran: "2024/2025" (regex validated)
- `semester` harus uppercase: 'GANJIL' atau 'GENAP'
- `label` optional untuk display custom (e.g., "Semester Ganjil 2024/2025")

---

### 7. **PRESTASI** (Achievement)

**Purpose**: Prestasi/penghargaan santri

**Attributes**:
```typescript
{
  namaLomba: string;
  bidang: string;
  penyelenggara: string;
  tingkat: enum ['Sekolah', 'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'];
  peringkat: enum ['Juara 1', 'Juara 2', 'Juara 3', 'Harapan 1', 'Harapan 2', 'Harapan 3'];
  tahun: string;  // e.g., "2024"
}
```

**Relations**:
- `santri` → manyToOne → Santri (inversedBy: prestasis)

**Lifecycle**: None

**Notes**: 
- Linked directly to Santri (tidak per periode kelas)
- `bidang` contoh: "Matematika", "IPA", "Olahraga", "Seni", "Tahfidz", "Bahasa"
- `tahun` dalam format string untuk fleksibilitas (e.g., "2024", "2023/2024")

---

### 8. **PELANGGARAN** (Violation)

**Purpose**: Catatan pelanggaran santri

**Attributes**:
```typescript
{
  jenis: string;         // e.g., "Terlambat", "Tidak memakai seragam"
  poin: integer;         // Bobot pelanggaran
  tanggal: date;
  keterangan: text;
}
```

**Relations**:
- `santri` → manyToOne → Santri (inversedBy: pelanggarans)

**Lifecycle**: None

**Notes**: 
- Linked directly to Santri (tidak per periode kelas)
- `poin` digunakan untuk sistem poin pelanggaran
- `jenis` contoh: "Terlambat", "Tidak pakai seragam", "Bolos", "Ribut di kelas"

---

### 9. **KEHADIRAN-GURU** (Teacher Attendance)

**Purpose**: Absensi guru

**Attributes**:
```typescript
{
  tanggal: date;
  jenis: enum ['HADIR', 'SAKIT', 'IZIN', 'ALPHA', 'TERLAMBAT'];
  keterangan: text;
}
```

**Relations**:
- `staff` → manyToOne → Staff (inversedBy: kehadiran)
- `kelas` → manyToOne → Kelas (inversedBy: kehadiran_guru)
- `tahunAjaran` → manyToOne → TahunAjaran (inversedBy: kehadiran_guru)

**Lifecycle**: None

**Notes**: 
- Linked to **Kelas + TahunAjaran** (bukan RiwayatKelas)
- Satu guru bisa mengajar di multiple kelas
- `jenis` order: HADIR, SAKIT, IZIN, ALPHA, TERLAMBAT

---

### 10. **KEHADIRAN-SANTRI** (Student Attendance)

**Purpose**: Absensi santri

**Attributes**:
```typescript
{
  tanggal: date;
  jenis: enum ['HADIR', 'SAKIT', 'IZIN', 'ALPHA', 'TERLAMBAT'];
  keterangan: text;
}
```

**Relations**:
- `santri` → manyToOne → Santri (inversedBy: kehadiran_santri)
- `riwayatKelas` → manyToOne → RiwayatKelas (inversedBy: kehadiran_santri)

**Lifecycle**: None

**Notes**: 
- Linked to **RiwayatKelas** (enrollment period)
- Memastikan absensi tercatat per periode enrollment
- `jenis` order: HADIR, SAKIT, IZIN, ALPHA, TERLAMBAT

---

## 🔄 Lifecycle Hooks Behavior

### 1. **RiwayatKelas Lifecycle**

**File**: `src/api/riwayat-kelas/content-types/riwayat-kelas/lifecycles.ts`

#### afterCreate Hook:
```typescript
// TRIGGER: Saat riwayat-kelas baru dibuat
// ACTION:
1. Extract kelasId dan tahunAjaranId dari params.data
2. Query Kelas untuk dapat string nama kelas
3. Query TahunAjaran untuk dapat string "YYYY/YYYY"
4. Update Santri:
   - Set kelasAktif = nama kelas (string)
   - Set tahunAjaranAktif = "YYYY/YYYY" (string)
   - Set tahunMasuk = extract tahun awal dari tahunAjaran (jika belum ada)
```

**Example**:
```javascript
// Input:
{
  santri: 1,
  kelas: 3,              // ID of "Kelas 1"
  tahunAjaran: 2,        // ID of "2024/2025"
  statusSantri: "AKTIF"
}

// Lifecycle auto-executes:
// 1. Query kelas ID 3 → get "Kelas 1"
// 2. Query tahunAjaran ID 2 → get "2024/2025"
// 3. Update santri ID 1:
//    - kelasAktif = "Kelas 1"
//    - tahunAjaranAktif = "2024/2025"
//    - tahunMasuk = "2024" (if not set)
```

#### afterUpdate Hook:
```typescript
// TRIGGER: Saat riwayat-kelas diupdate dan statusSantri jadi "LULUS"
// ACTION:
1. Check if statusSantri === 'LULUS'
2. Get tahunAjaranId
3. Query TahunAjaran untuk dapat string "YYYY/YYYY"
4. Update Santri:
   - Set isAlumni = true
   - Set tahunLulus = extract tahun akhir (misal "2025" dari "2024/2025")
```

**Example**:
```javascript
// Input:
{
  id: 5,
  statusSantri: "LULUS",    // Changed from "AKTIF" to "LULUS"
  tanggalSelesai: "2025-06-30"
}

// Lifecycle auto-executes:
// 1. Detect statusSantri === "LULUS"
// 2. Get tahunAjaran → "2024/2025"
// 3. Update santri:
//    - isAlumni = true
//    - tahunLulus = "2025"
```

---

### 2. **TahunAjaran Lifecycle**

**File**: `src/api/tahun-ajaran/content-types/tahun-ajaran/lifecycles.ts`

#### afterUpdate Hook:
```typescript
// TRIGGER: Saat tahun ajaran di-nonaktifkan (aktif: false)
// ACTION:
1. Check if aktif === false
2. Get tahunAjaran string (e.g., "2023/2024")
3. Find all Santri where tahunAjaranAktif === "2023/2024"
4. Update all matching Santri:
   - Set tahunAjaranAktif = null
```

**Example**:
```javascript
// Input: Deactivate tahun ajaran 2023/2024
{
  id: 1,
  aktif: false    // Changed from true to false
}

// Lifecycle auto-executes:
// 1. Get tahunAjaran = "2023/2024"
// 2. Find santri where tahunAjaranAktif === "2023/2024"
// 3. Update all → tahunAjaranAktif = null
```

#### beforeDelete Hook:
```typescript
// TRIGGER: Saat tahun ajaran mau dihapus
// ACTION:
1. Count RiwayatKelas yang masih terkait dengan tahun ajaran ini
2. If count > 0, throw error → PREVENT DELETE
3. If count === 0, allow delete
```

**Example**:
```javascript
// Try to delete tahun ajaran
DELETE /api/tahun-ajarans/1

// Lifecycle checks:
// - If riwayatKelas exists → ERROR: "Cannot delete, still in use"
// - If no riwayatKelas → OK, delete allowed
```

---

## 🔑 Key Design Decisions

### 1. **Denormalization: kelasAktif & tahunAjaranAktif**

**Why**: Performance optimization

**Before** (Relational):
```typescript
santri.kelasAktif → Relation → Kelas entity
santri.tahunAjaranAktif → Relation → TahunAjaran entity
```

**After** (Denormalized):
```typescript
santri.kelasAktif: "Kelas 1" (string)
santri.tahunAjaranAktif: "2024/2025" (string)
```

**Benefits**:
- ✅ Query santri tanpa JOIN (faster)
- ✅ Frontend dapat langsung display tanpa populate
- ✅ Filter by class name dengan simple string match

**Trade-off**:
- ⚠️ Must maintain consistency via lifecycle
- ⚠️ Cannot use relational filters (acceptable for shortcut fields)

---

### 2. **Kehadiran: Guru vs Santri**

**Kehadiran Guru** → Linked to **Kelas + TahunAjaran**:
- Reason: Guru mengajar di multiple kelas, per semester
- Query: "Kehadiran Ustadz Ahmad mengajar Kelas 1 tahun 2024/2025"

**Kehadiran Santri** → Linked to **RiwayatKelas**:
- Reason: Santri punya enrollment period specific
- Query: "Kehadiran Ahmad Zaki di Kelas 1 periode 2024/2025"

---

### 3. **No Direct Santri ↔ Kelas Relation**

**Why**: Historical tracking

**Pattern**: Santri → RiwayatKelas → Kelas
- Satu santri bisa punya multiple entries (naik kelas tiap tahun)
- RiwayatKelas adalah "source of truth" untuk posisi santri

**Example Timeline**:
```
2023/2024: Santri di Kelas 1 (RiwayatKelas entry 1)
2024/2025: Santri di Kelas 2 (RiwayatKelas entry 2)
2025/2026: Santri di Kelas 3 (RiwayatKelas entry 3)
```

---

## 📋 Validation Rules

### NISN:
- ✅ Must be unique
- ✅ String format (to preserve leading zeros)

### Tahun Ajaran:
- ✅ Regex: `^\d{4}/\d{4}$` (e.g., "2024/2025")
- ✅ Only 1 can be active (`aktif: true`)

### Status Santri:
- ✅ Enum: 'AKTIF', 'NAIK_KELAS', 'PINDAH', 'KELUAR', 'LULUS'
- ✅ Cannot delete tahun ajaran if RiwayatKelas exists

---

## 🚨 Common Pitfalls

### ❌ DON'T:
1. Edit `kelasAktif` manually di Santri → Will be overwritten by lifecycle
2. Edit `tahunAjaranAktif` manually → Will be overwritten
3. Edit `isAlumni` manually → Will be overwritten
4. Create Santri without Lembaga → Error
5. Create RiwayatKelas without TahunAjaran → kelasAktif won't update
6. Delete TahunAjaran still in use → Lifecycle will block with error
7. Update existing RiwayatKelas entry when santri naik kelas → Create new entry instead

### ✅ DO:
1. Always create RiwayatKelas after creating Santri
2. Let lifecycle manage shortcut fields
3. Create new RiwayatKelas entry when santri naik kelas
4. Use statusSantri to track santri lifecycle
5. Set statusSantri to "LULUS" to auto-set isAlumni

---

## 🎯 Query Performance Tips

1. **Filter by Lembaga first** to reduce result set
2. **Use string fields** (kelasAktif, tahunAjaranAktif) for simple filters
3. **Populate selectively** - don't use `populate=*` in production
4. **Index** frequently queried fields (nisn, nama)
5. **Cache** lembaga, kelas, tahunAjaran (rarely change)

---

## 📚 Related Documentation

- **[DATA_INPUT_WORKFLOW.md](./DATA_INPUT_WORKFLOW.md)** - Step-by-step input guide
- **[API_QUERY_EXAMPLES.md](./API_QUERY_EXAMPLES.md)** - Query patterns for frontend

---

## 📝 Recent Schema Changes (October 1, 2025)

### **Staff Entity - NEW FIELDS:**
- ✅ Added `nip` (string) - Nomor Induk Pegawai (18 digit)
- ✅ Added `NIK` (string) - Nomor Induk Kependudukan (16 digit)
- ✅ Added `noTelepon` (string)
- ✅ Added `namaIbu` (string)
- ✅ Added `statusKepegawaian` (enum: PNS, GTY, GTTY, HONORER, KONTRAK)
- ✅ Added `mulaiTugas` (date)
- ✅ Added `pendidikanTerakhir` (enum: S1, S2, S3)
- ✅ Added `lulusan` (string)
- ✅ Added `statusPNS` (boolean)
- ✅ Added `statusGuruTetap` (boolean)
- ✅ Added `sertifikasi` (text)

### **Riwayat-Kelas Entity - ENUM UPDATE:**
- ❌ Removed `NAIK_KELAS` from statusSantri enum
- ❌ Removed `KELUAR` from statusSantri enum
- ✅ Current enum: ['AKTIF', 'LULUS', 'PINDAH', 'CUTI']

### **Tahun-Ajaran Entity - ENUM UPDATE:**
- ✅ Changed semester enum from 'Ganjil'/'Genap' to 'GANJIL'/'GENAP' (uppercase)
- ✅ Made `semester` required field
- ✅ Made `aktif` required field

### **Kehadiran (Guru & Santri) - ENUM UPDATE:**
- ✅ Added `TERLAMBAT` to jenis enum
- ✅ Current enum: ['HADIR', 'SAKIT', 'IZIN', 'ALPHA', 'TERLAMBAT']

---

**Last Updated**: October 1, 2025
