# 🔗 Database Schema & Relationships - Strapi Ponpes

Dokumentasi lengkap struktur database, relasi antar entity, dan lifecycle hooks.

---

## 📊 Entity Relationship Diagram (ERD)

```
┌─────────────────────┐
│     LEMBAGA         │◄────────┐
│ - nama              │         │
│ - slug              │         │
│ - profilMd          │         │
└──────┬──────────────┘         │
       │ oneToMany              │
       │                        │
       ├────────────────────────┼──────────────┐
       │                        │              │
       ▼                        ▼              ▼
┌──────────────┐      ┌─────────────────┐  ┌────────────┐
│    KELAS     │      │     SANTRI      │  │   STAFF    │
│ - kelas      │      │ - nama          │  │ - nama     │
│              │      │ - nisn (unique) │  │ - nip      │
└──────┬───────┘      │ - kelasAktif*   │  │ - aktif    │
       │              │ - tahunAjaranAktif*│ - kategori │
       │              │ - isAlumni*     │  └─────┬──────┘
       │              │ - tahunMasuk    │        │
       │              │ - tahunLulus*   │        │
       │              └────┬─────┬──────┘        │
       │                   │     │               │
       │ oneToMany         │     │oneToMany      │
       │                   │     │               │
       ▼                   │     ▼               ▼
┌──────────────────┐       │  ┌──────────────────────┐
│  RIWAYAT-KELAS   │◄──────┘  │     PRESTASI         │
│ - statusSantri   │          │ - namaLomba          │
│ - tanggalMulai   │          │ - tingkat            │
│ - tanggalSelesai │          │ - peringkat          │
│ - catatan        │          └──────────────────────┘
└────┬────┬────────┘          
     │    │                   ┌──────────────────────┐
     │    └──────────────────►│    PELANGGARAN       │
     │                        │ - jenis              │
     │                        │ - poin               │
     │                        │ - tanggal            │
     │                        └──────────────────────┘
     │
     │ oneToMany
     │
     ▼
┌──────────────────────┐
│  KEHADIRAN-SANTRI    │
│ - tanggal            │
│ - jenis              │
│ - keterangan         │
└──────────────────────┘


┌─────────────────────┐
│   TAHUN-AJARAN      │
│ - tahunAjaran       │
│ - semester          │
│ - aktif (unique)    │
└──────┬──────────────┘
       │
       ├─────────────────────┐
       │ oneToMany           │
       │                     │
       ▼                     ▼
┌──────────────────┐  ┌──────────────────┐
│  RIWAYAT-KELAS   │  │  KEHADIRAN-GURU  │
│  (linked above)  │  │ - tanggal        │
└──────────────────┘  │ - jenis          │
                      │ - keterangan     │
                      └──────┬───────────┘
                             │ manyToOne
                             ▼
                      ┌──────────────┐
                      │    KELAS     │
                      │ (linked above)│
                      └──────────────┘
```

**Legend**:
- `*` = Auto-populated by lifecycle (jangan edit manual)
- `─►` = Relation
- `unique` = Nilai harus unik di database

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
  nama: string;
  nisn: string (unique);
  gender: enum ['L', 'P'];
  tempatLahir: string;
  tanggalLahir: date;
  namaAyah: string;
  namaIbu: string;
  kelurahan: string;
  kecamatan: string;
  kota: string;
  nomorIjazah: string;
  tahunIjazah: string;
  foto: media;
  
  // AUTO-POPULATED (Shortcut fields)
  kelasAktif: string;
  tahunAjaranAktif: string;
  isAlumni: boolean (default: false);
  tahunMasuk: string;
  tahunLulus: string;
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
- **JANGAN EDIT** `kelasAktif`, `tahunAjaranAktif`, `isAlumni`, `tahunLulus`
- Fields tersebut auto-update dari riwayat-kelas

---

### 3. **STAFF** (Teacher/Staff)

**Purpose**: Data guru dan karyawan

**Attributes**:
```typescript
{
  nama: string;
  nip: string;
  gender: enum ['L', 'P'];
  tempatLahir: string;
  tanggalLahir: date;
  agama: enum ['ISLAM'];
  kategoriPersonil: enum ['GURU', 'PENGURUS', 'STAFF'];
  keteranganTugas: text;
  aktif: boolean;
  foto: media;
}
```

**Relations**:
- `lembaga` → manyToOne → Lembaga (inversedBy: staffs)
- `kehadiran` → oneToMany → KehadiranGuru (mappedBy: staff)

**Lifecycle**: None

**Notes**: Bisa aktif/non-aktif dengan field `aktif`

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
  statusSantri: enum ['AKTIF', 'NAIK_KELAS', 'PINDAH', 'KELUAR', 'LULUS'];
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

---

### 6. **TAHUN-AJARAN** (Academic Year)

**Purpose**: Periode tahun ajaran

**Attributes**:
```typescript
{
  tahunAjaran: string (required, regex: ^\d{4}/\d{4}$);
  semester: enum ['Ganjil', 'Genap'];
  aktif: boolean (default: false);
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
- **HANYA 1 tahun ajaran aktif** di satu waktu
- Format: "2024/2025"

---

### 7. **PRESTASI** (Achievement)

**Purpose**: Prestasi/penghargaan santri

**Attributes**:
```typescript
{
  namaLomba: string;
  penyelenggara: string;
  tingkat: enum ['Sekolah', 'Kecamatan', 'Kabupaten/Kota', 'Provinsi', 'Nasional', 'Internasional'];
  peringkat: enum ['Juara 1', 'Juara 2', 'Juara 3', 'Harapan 1', 'Harapan 2', 'Harapan 3'];
  bidang: string;
  tahun: string;
}
```

**Relations**:
- `santri` → manyToOne → Santri (inversedBy: prestasis)

**Lifecycle**: None

**Notes**: Linked directly to Santri (tidak per periode kelas)

---

### 8. **PELANGGARAN** (Violation)

**Purpose**: Catatan pelanggaran santri

**Attributes**:
```typescript
{
  jenis: string;
  poin: integer;
  tanggal: date;
  keterangan: text;
}
```

**Relations**:
- `santri` → manyToOne → Santri (inversedBy: pelanggarans)

**Lifecycle**: None

**Notes**: Linked directly to Santri (tidak per periode kelas)

---

### 9. **KEHADIRAN-GURU** (Teacher Attendance)

**Purpose**: Absensi guru

**Attributes**:
```typescript
{
  tanggal: date;
  jenis: enum ['HADIR', 'SAKIT', 'IZIN', 'ALPHA'];
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

---

### 10. **KEHADIRAN-SANTRI** (Student Attendance)

**Purpose**: Absensi santri

**Attributes**:
```typescript
{
  tanggal: date;
  jenis: enum ['HADIR', 'SAKIT', 'IZIN', 'ALPHA'];
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

**Last Updated**: October 1, 2025
