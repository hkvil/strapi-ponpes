# 📋 Quick Reference Card - Strapi Ponpes

Cheat sheet untuk operasi umum dalam sistem manajemen pesantren.

---

## 🚀 Quick Start Commands

```bash
# Development
npm run develop              # Start dev server + watch mode
npm run build               # Build production
npm run start               # Start production server

# Access
http://localhost:1337/admin # Admin panel
http://localhost:1337/api   # API endpoint
```

---

## 📝 Input Data Order (MANDATORY!)

```
1️⃣ LEMBAGA (institution)
   ↓
2️⃣ TAHUN-AJARAN (academic year, set aktif: true)
   ↓
3️⃣ KELAS (class levels)
   ↓
4️⃣ STAFF (optional, for attendance)
   ↓
5️⃣ SANTRI (student biodata)
   ↓
6️⃣ RIWAYAT-KELAS (enroll santri to class) 🎯 TRIGGERS LIFECYCLE!
```

---

## 🤖 Auto-Populated Fields (DON'T EDIT!)

| Entity | Field | Auto-Set By | When |
|--------|-------|-------------|------|
| **SANTRI** | `kelasAktif` | RiwayatKelas lifecycle | Create/Update riwayat-kelas |
| **SANTRI** | `tahunAjaranAktif` | RiwayatKelas lifecycle | Create/Update riwayat-kelas |
| **SANTRI** | `isAlumni` | RiwayatKelas lifecycle | Update status → "LULUS" |
| **SANTRI** | `tahunLulus` | RiwayatKelas lifecycle | Update status → "LULUS" |
| **SANTRI** | `tahunMasuk` | RiwayatKelas lifecycle | First riwayat-kelas entry |

---

## 🔍 Common Query Patterns

### Filter by Lembaga
```
?filters[lembaga][id][$eq]=1
```

### Santri Aktif (Bukan Alumni)
```
?filters[isAlumni][$eq]=false
```

### Santri di Kelas Tertentu
```
?filters[kelasAktif][$eq]=Kelas 1
```

### Search by Name (Case-Insensitive)
```
?filters[nama][$containsi]=ahmad
```

### Populate Relations
```
?populate[lembaga]=*&populate[riwayatKelas][populate][kelas]=*
```

### Pagination
```
?pagination[page]=1&pagination[pageSize]=25
```

### Sorting
```
?sort=nama:asc
?sort[0]=kelasAktif:asc&sort[1]=nama:asc
```

---

## 📊 Entity Quick Reference

### LEMBAGA
```javascript
POST /api/lembagas
{
  "data": {
    "nama": "MI Al-Hikmah",
    "slug": "mi-al-hikmah"  // auto-generated
  }
}
```

### TAHUN-AJARAN
```javascript
POST /api/tahun-ajarans
{
  "data": {
    "tahunAjaran": "2024/2025",  // Format: YYYY/YYYY
    "semester": "Ganjil",         // or "Genap"
    "aktif": true                 // ONLY 1 can be true!
  }
}
```

### KELAS
```javascript
POST /api/kelass
{
  "data": {
    "kelas": "Kelas 1",           // Free text
    "lembaga": 1                  // ID
  }
}
```

### SANTRI
```javascript
POST /api/santris
{
  "data": {
    "nama": "Ahmad Zaki",
    "nisn": "0123456789",         // Must be unique
    "lembaga": 1,
    "gender": "L",                // "L" or "P"
    "tempatLahir": "Surabaya",
    "tanggalLahir": "2010-05-20"
  }
}
```

### RIWAYAT-KELAS (⚡ Triggers Lifecycle!)
```javascript
POST /api/riwayat-kelass
{
  "data": {
    "santri": 15,                 // ID
    "kelas": 3,                   // ID
    "tahunAjaran": 2,             // ID
    "statusSantri": "AKTIF",
    "tanggalMulai": "2024-07-15"
  }
}
// → Auto-updates santri.kelasAktif, tahunAjaranAktif, tahunMasuk
```

### STAFF
```javascript
POST /api/staffs
{
  "data": {
    "nama": "Ustadz Ahmad",
    "nip": "123456789",
    "lembaga": 1,
    "gender": "L",
    "kategoriPersonil": "GURU",   // GURU, PENGURUS, or STAFF
    "aktif": true
  }
}
```

### PRESTASI
```javascript
POST /api/prestasis
{
  "data": {
    "santri": 15,
    "namaLomba": "Olimpiade Matematika",
    "tingkat": "Kabupaten/Kota",  // Sekolah → Internasional
    "peringkat": "Juara 1",        // Juara 1,2,3 or Harapan 1,2,3
    "tahun": "2024"
  }
}
```

### PELANGGARAN
```javascript
POST /api/pelanggarans
{
  "data": {
    "santri": 15,
    "jenis": "Terlambat",
    "poin": 5,
    "tanggal": "2024-09-15",
    "keterangan": "Terlambat 30 menit"
  }
}
```

### KEHADIRAN-GURU
```javascript
POST /api/kehadiran-gurus
{
  "data": {
    "staff": 1,                   // ID
    "kelas": 3,                   // ID
    "tahunAjaran": 2,             // ID
    "tanggal": "2024-09-15",
    "jenis": "HADIR"              // HADIR, SAKIT, IZIN, ALPHA
  }
}
```

### KEHADIRAN-SANTRI
```javascript
POST /api/kehadiran-santris
{
  "data": {
    "santri": 15,                 // ID
    "riwayatKelas": 5,            // ID (not kelas!)
    "tanggal": "2024-09-15",
    "jenis": "HADIR"              // HADIR, SAKIT, IZIN, ALPHA
  }
}
```

---

## 🔄 Common Workflows

### ✅ Input Santri Baru
```
1. POST /api/santris { nama, nisn, lembaga, ... }
   → Get santri ID
2. POST /api/riwayat-kelass { santri: ID, kelas, tahunAjaran, ... }
   → Lifecycle auto-populates kelasAktif, tahunAjaranAktif
3. Verify: GET /api/santris/:id
```

### ✅ Santri Naik Kelas
```
1. PUT /api/riwayat-kelass/:oldId { statusSantri: "NAIK_KELAS", tanggalSelesai }
2. POST /api/riwayat-kelass { santri, kelas: newKelas, tahunAjaran: newTA, ... }
   → Lifecycle updates kelasAktif to new class
```

### ✅ Santri Lulus (Alumni)
```
1. PUT /api/riwayat-kelass/:id { statusSantri: "LULUS", tanggalSelesai }
   → Lifecycle auto-sets isAlumni: true, tahunLulus
2. Verify: GET /api/santris/:id
   → isAlumni should be true
```

### ✅ Query Alumni
```
GET /api/santris?filters[isAlumni][$eq]=true&filters[lembaga][id][$eq]=1
```

### ✅ Query Santri Aktif per Kelas
```
GET /api/santris?filters[kelasAktif][$eq]=Kelas 1&filters[isAlumni][$eq]=false
```

### ✅ Rekap Kehadiran Santri Bulan Ini
```
GET /api/kehadiran-santris?filters[santri][id][$eq]=15&filters[tanggal][$gte]=2024-09-01&filters[tanggal][$lte]=2024-09-30
```

---

## 🎯 Status Santri Flow

```
AKTIF → NAIK_KELAS → [Create new entry] → AKTIF
  ↓
LULUS (isAlumni = true)
  ↓
PINDAH / KELUAR
```

---

## ⚠️ Common Mistakes

| ❌ DON'T | ✅ DO |
|---------|-------|
| Edit `kelasAktif` manually | Let lifecycle update it |
| Edit `tahunAjaranAktif` manually | Let lifecycle update it |
| Edit `isAlumni` manually | Change status to "LULUS" |
| Update existing riwayat-kelas when naik kelas | Create new riwayat-kelas entry |
| Delete tahun ajaran in use | Check usage first (lifecycle will block) |
| Create 2 active tahun ajaran | System allows only 1 active |

---

## 🔐 API Authentication

### Get JWT Token
```bash
POST /api/auth/local
{
  "identifier": "your@email.com",
  "password": "yourpassword"
}
# Response: { jwt: "your-token" }
```

### Use Token
```bash
curl -H "Authorization: Bearer your-token" \
  http://localhost:1337/api/santris
```

---

## 🛠️ Debugging Tips

### Check Lifecycle Execution
Look at Strapi logs in terminal:
```
[lifecycle] afterCreate riwayat-kelas
[lifecycle] Updating santri kelasAktif...
```

### Verify Auto-Population
```bash
# After creating riwayat-kelas
GET /api/santris/:id?fields[0]=kelasAktif&fields[1]=tahunAjaranAktif
# Should return populated values
```

### Check Active Tahun Ajaran
```bash
GET /api/tahun-ajarans?filters[aktif][$eq]=true
# Should return exactly 1 result
```

---

## 📚 Full Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Overview & getting started |
| [DATA_INPUT_WORKFLOW.md](./DATA_INPUT_WORKFLOW.md) | Step-by-step input guide |
| [API_QUERY_EXAMPLES.md](./API_QUERY_EXAMPLES.md) | 100+ API query examples |
| [SCHEMA_RELATIONSHIPS.md](./SCHEMA_RELATIONSHIPS.md) | ERD & lifecycle details |
| [VISUAL_DIAGRAM.md](./VISUAL_DIAGRAM.md) | Visual schema diagrams |

---

## 🆘 Quick Help

**Problem**: kelasAktif not updating after create riwayat-kelas  
**Solution**: Check lifecycle logs, verify kelas & tahunAjaran IDs exist

**Problem**: Can't delete tahun ajaran  
**Solution**: Lifecycle blocks if riwayat-kelas exists, delete those first

**Problem**: Two tahun ajaran active at once  
**Solution**: Lifecycle should prevent this, deactivate manually if needed

**Problem**: isAlumni not auto-setting  
**Solution**: Make sure statusSantri is exactly "LULUS" (case-sensitive)

---

**Print this card for quick reference! 📄**

Last Updated: October 1, 2025
