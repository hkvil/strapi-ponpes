# 📚 Strapi Ponpes - Complete Documentation

Dokumentasi lengkap sistem manajemen pesantren dengan Strapi CMS v5.

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Documentation Index](#documentation-index)
4. [System Architecture](#system-architecture)
5. [Key Features](#key-features)
6. [Technology Stack](#technology-stack)

---

## 🎯 Overview

**Strapi Ponpes** adalah sistem manajemen pesantren berbasis **Strapi CMS v5** dengan fitur:

✅ Multi-lembaga (MI, MTs, MA, Ponpes)  
✅ Manajemen santri & staff  
✅ Riwayat kelas dengan tracking historis  
✅ Absensi guru & santri  
✅ Prestasi & pelanggaran  
✅ Auto-populate shortcut fields via lifecycle  
✅ RESTful API dengan filtering & pagination  

---

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.x
- PostgreSQL (atau database pilihan Anda)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd my-strapi-project

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env sesuai konfigurasi database Anda

# Run development server
npm run develop

# Access admin panel
# http://localhost:1337/admin
```

### First Time Setup

1. **Create Admin User** di http://localhost:1337/admin
2. **Create Lembaga** (unit pendidikan)
3. **Create Tahun Ajaran** (set aktif: true)
4. **Create Kelas** untuk lembaga tersebut
5. **Ready to input data!** 🎉

📖 **Detail guide**: [DATA_INPUT_WORKFLOW.md](./DATA_INPUT_WORKFLOW.md)

---

## 📑 Documentation Index

### 🔰 For Backend Developers

| Document | Description |
|----------|-------------|
| **[SCHEMA_RELATIONSHIPS.md](./SCHEMA_RELATIONSHIPS.md)** | 📐 ERD, relasi antar entity, lifecycle hooks |
| **[DATA_INPUT_WORKFLOW.md](./DATA_INPUT_WORKFLOW.md)** | 📝 Urutan input data yang benar, checklist |

### 🎨 For Frontend Developers

| Document | Description |
|----------|-------------|
| **[API_QUERY_EXAMPLES.md](./API_QUERY_EXAMPLES.md)** | 🔍 Contoh query API lengkap dengan response |
| **[DATA_INPUT_WORKFLOW.md](./DATA_INPUT_WORKFLOW.md)** | 📊 Query patterns untuk search/filter |

### 📚 Quick Reference

| Topic | Where to Find |
|-------|---------------|
| Setup awal | [Quick Start](#quick-start) |
| Cara input santri | [DATA_INPUT_WORKFLOW.md](./DATA_INPUT_WORKFLOW.md#3️⃣-input-santri) |
| Query santri per lembaga | [API_QUERY_EXAMPLES.md](./API_QUERY_EXAMPLES.md#1️⃣-query-santri) |
| Auto-populate lifecycle | [SCHEMA_RELATIONSHIPS.md](./SCHEMA_RELATIONSHIPS.md#🔄-lifecycle-hooks-behavior) |
| Search alumni | [API_QUERY_EXAMPLES.md](./API_QUERY_EXAMPLES.md#filter-santri-aktif-vs-alumni) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────┐
│           Frontend (React/Next.js/etc)          │
│          Query API with filters & populate       │
└────────────────────┬────────────────────────────┘
                     │ HTTP REST API
                     ▼
┌─────────────────────────────────────────────────┐
│              Strapi CMS v5 Backend              │
│  ┌──────────────────────────────────────────┐   │
│  │         Content-Type Schemas             │   │
│  │  (santri, staff, kelas, riwayat-kelas)  │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │           Lifecycle Hooks                │   │
│  │  (auto-populate kelasAktif, isAlumni)   │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │        Entity Service API                │   │
│  │   (findOne, findMany, update, delete)    │   │
│  └──────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────┘
                     │ Database Driver
                     ▼
┌─────────────────────────────────────────────────┐
│         Database (PostgreSQL/SQLite)            │
│    santris, staffs, kelass, riwayat_kelass     │
└─────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 1. Multi-Lembaga Support
- Satu sistem untuk multiple unit (MI, MTs, MA)
- Filter data per lembaga atau keseluruhan
- Isolated data per lembaga

### 2. Historical Class Tracking
- `RiwayatKelas` entity untuk track enrollment period
- Santri bisa punya multiple entries (naik kelas tiap tahun)
- Kehadiran santri terikat ke enrollment period

### 3. Auto-Populate Shortcut Fields
- **kelasAktif**: Auto-update saat buat/edit riwayat-kelas
- **tahunAjaranAktif**: Auto-update dari tahun ajaran aktif
- **isAlumni**: Auto-set saat statusSantri = "LULUS"
- **tahunLulus**: Auto-set dari tahun ajaran saat lulus

### 4. Intelligent Lifecycle Hooks
- Prevent delete tahun ajaran jika masih dipakai
- Clear tahunAjaranAktif saat tahun ajaran di-nonaktifkan
- Set tahunMasuk otomatis saat santri pertama kali masuk

### 5. Flexible Attendance Tracking
- **Kehadiran Guru**: Per kelas + tahun ajaran
- **Kehadiran Santri**: Per riwayat kelas (enrollment period)
- Support HADIR, SAKIT, IZIN, ALPHA

### 6. Achievement & Violation Tracking
- Prestasi: Track tingkat lomba (sekolah → internasional)
- Pelanggaran: Track dengan poin system

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|------------|
| **CMS Framework** | Strapi v5.23.5 |
| **Runtime** | Node.js v22.19.0 |
| **Language** | TypeScript |
| **Database** | PostgreSQL (or SQLite for dev) |
| **ORM** | Built-in Strapi Entity Service |
| **API** | REST API with filtering & pagination |

---

## 📊 Database Entities

| Entity | Description | Key Relations |
|--------|-------------|---------------|
| **Lembaga** | Institution/Unit pendidikan | → Santri, Staff, Kelas |
| **Santri** | Student data | → Lembaga, RiwayatKelas, Prestasi |
| **Staff** | Teacher/Staff data | → Lembaga, KehadiranGuru |
| **Kelas** | Class/Grade levels | → Lembaga, RiwayatKelas |
| **RiwayatKelas** | Enrollment history | → Santri, Kelas, TahunAjaran |
| **TahunAjaran** | Academic year | → RiwayatKelas, KehadiranGuru |
| **Prestasi** | Student achievements | → Santri |
| **Pelanggaran** | Student violations | → Santri |
| **KehadiranGuru** | Teacher attendance | → Staff, Kelas, TahunAjaran |
| **KehadiranSantri** | Student attendance | → Santri, RiwayatKelas |

📖 **Full ERD**: [SCHEMA_RELATIONSHIPS.md](./SCHEMA_RELATIONSHIPS.md)

---

## 🔑 Core Concepts

### 1. Shortcut Fields (Denormalization)

Fields yang di-denormalized untuk performance:
- `kelasAktif` (string) - instead of relation
- `tahunAjaranAktif` (string) - instead of relation

**Benefits**: Faster queries, no JOIN needed  
**Trade-off**: Must maintain via lifecycle  

📖 **Detail**: [SCHEMA_RELATIONSHIPS.md#key-design-decisions](./SCHEMA_RELATIONSHIPS.md#🔑-key-design-decisions)

---

### 2. Status Santri Lifecycle

```
AKTIF → NAIK_KELAS → AKTIF (new entry)
  ↓
LULUS (isAlumni = true)
  ↓
PINDAH / KELUAR
```

📖 **Detail**: [DATA_INPUT_WORKFLOW.md#f-daftarkan-santri-ke-kelas](./DATA_INPUT_WORKFLOW.md#f-daftarkan-santri-ke-kelas-wajib)

---

### 3. Active Academic Year

- **HANYA 1** tahun ajaran bisa aktif
- Lifecycle auto-deactivate yang lain saat ada yang diaktifkan
- Cannot delete jika masih ada RiwayatKelas terkait

📖 **Detail**: [SCHEMA_RELATIONSHIPS.md#lifecycle-hooks-behavior](./SCHEMA_RELATIONSHIPS.md#🔄-lifecycle-hooks-behavior)

---

## 📋 Common Use Cases

### Use Case 1: Input Santri Baru

```
1. Create Santri (biodata)
2. Create RiwayatKelas (daftarkan ke kelas)
3. Lifecycle auto-populate:
   - kelasAktif
   - tahunAjaranAktif
   - tahunMasuk
```

📖 **Step-by-step**: [DATA_INPUT_WORKFLOW.md#skenario-input-santri-baru](./DATA_INPUT_WORKFLOW.md#🎓-contoh-workflow-lengkap)

---

### Use Case 2: Santri Naik Kelas

```
1. Update RiwayatKelas lama:
   - statusSantri = "NAIK_KELAS"
   - tanggalSelesai = end date
2. Create RiwayatKelas baru:
   - kelas = kelas baru
   - tahunAjaran = tahun ajaran baru
3. Lifecycle auto-update kelasAktif & tahunAjaranAktif
```

📖 **Detail**: [DATA_INPUT_WORKFLOW.md#f-daftarkan-santri-ke-kelas](./DATA_INPUT_WORKFLOW.md#f-daftarkan-santri-ke-kelas-wajib)

---

### Use Case 3: Query Alumni

```javascript
// Alumni di lembaga tertentu
GET /api/santris?filters[isAlumni][$eq]=true&filters[lembaga][id][$eq]=1

// Alumni lulus tahun tertentu
GET /api/santris?filters[isAlumni][$eq]=true&filters[tahunLulus][$eq]=2024
```

📖 **More examples**: [API_QUERY_EXAMPLES.md#filter-santri-aktif-vs-alumni](./API_QUERY_EXAMPLES.md#filter-santri-aktif-vs-alumni)

---

## ⚠️ Important Notes

### ❌ DON'T DO THIS:
1. ❌ Edit `kelasAktif` manually → Will be overwritten by lifecycle
2. ❌ Edit `tahunAjaranAktif` manually → Will be overwritten
3. ❌ Edit `isAlumni` manually → Will be overwritten
4. ❌ Create Santri without Lembaga → Error
5. ❌ Edit existing RiwayatKelas when santri naik kelas → Create new entry

### ✅ BEST PRACTICES:
1. ✅ Always create Lembaga → TahunAjaran → Kelas first
2. ✅ Create RiwayatKelas immediately after creating Santri
3. ✅ Let lifecycle manage shortcut fields
4. ✅ Create new RiwayatKelas entry when santri naik kelas
5. ✅ Use statusSantri to track student lifecycle

---

## 🔍 Search & Filter Examples

```javascript
// Santri aktif di lembaga tertentu
GET /api/santris?filters[lembaga][id][$eq]=1&filters[isAlumni][$eq]=false

// Santri di kelas tertentu
GET /api/santris?filters[kelasAktif][$eq]=Kelas 1

// Search by nama (case-insensitive)
GET /api/santris?filters[nama][$containsi]=ahmad

// Prestasi tingkat nasional
GET /api/prestasis?filters[tingkat][$eq]=Nasional&populate[santri][populate][lembaga]=*

// Staff guru aktif
GET /api/staffs?filters[kategoriPersonil][$eq]=GURU&filters[aktif][$eq]=true
```

📖 **100+ query examples**: [API_QUERY_EXAMPLES.md](./API_QUERY_EXAMPLES.md)

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Create Lembaga
- [ ] Create TahunAjaran (aktif: true)
- [ ] Create Kelas
- [ ] Create Santri
- [ ] Create RiwayatKelas → Verify kelasAktif auto-populated
- [ ] Update RiwayatKelas status to "LULUS" → Verify isAlumni = true
- [ ] Try delete TahunAjaran → Should be blocked
- [ ] Deactivate TahunAjaran → Verify tahunAjaranAktif cleared in Santri

---

## 🚀 Deployment

### Production Build

```bash
# Build Strapi
npm run build

# Start production server
npm run start
```

### Environment Variables

```env
# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=strapi_ponpes
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password

# Strapi
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
ADMIN_JWT_SECRET=your-admin-jwt-secret
TRANSFER_TOKEN_SALT=your-transfer-token-salt
JWT_SECRET=your-jwt-secret
```

---

## 📞 Support

For questions or issues:
1. Check documentation in `/docs` folder
2. Review [API_QUERY_EXAMPLES.md](./API_QUERY_EXAMPLES.md) for query patterns
3. Check [SCHEMA_RELATIONSHIPS.md](./SCHEMA_RELATIONSHIPS.md) for data structure

---

## 📄 License

[Your License Here]

---

**Built with ❤️ using Strapi CMS v5**

Last Updated: October 1, 2025
