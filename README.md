# 🏫 Strapi Ponpes Management System

Sistem Manajemen Pondok Pesantren berbasis Strapi CMS v5 dengan TypeScript dan SQLite.

## 📋 Daftar Isi

- [Features](#-features)
- [Quick Start](#-quick-start)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)
- [Learn More](#-learn-more)

---

## ✨ Features

- 🎓 **Multi-Lembaga**: Kelola TK, RA, MI, MTs, MA (Putra & Putri)
- 👥 **Manajemen Santri**: Data lengkap dengan lifecycle tracking (aktif → alumni)
- 👨‍🏫 **Manajemen Staff/Guru**: Termasuk NIK, NIP, dan status kepegawaian
- 📊 **Prestasi & Pelanggaran**: Tracking pencapaian dan pelanggaran santri
- ✅ **Kehadiran**: Sistem absensi untuk santri dan guru
- 🏆 **Riwayat Kelas**: Historical tracking perpindahan kelas santri
- 📅 **Tahun Ajaran**: Management tahun ajaran dengan status aktif
- 🔄 **Auto Lifecycle**: Otomatis populate `kelasAktif`, `tahunAjaranAktif`, `isAlumni`
- 🌱 **Seeder**: Generate ~8,200 sample records untuk development

---

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- NPM >= 6.x
- RAM >= 4GB (recommended)

### Installation

```bash
# Install dependencies
npm install

# Run seeder (optional - untuk sample data)
npm run seed:example

# Start development server
npm run develop
```

Server akan berjalan di: **http://localhost:1337**

### Default Admin

Setelah setup pertama kali, buat admin user melalui:
```
http://localhost:1337/admin
```

---

## 📚 Documentation

Dokumentasi lengkap tersedia di folder `/docs`:

| File | Deskripsi |
|------|-----------|
| [SCHEMA_RELATIONSHIPS.md](docs/SCHEMA_RELATIONSHIPS.md) | Schema, relasi, dan ERD lengkap |
| [API_ENDPOINTS.md](docs/API_ENDPOINTS.md) | Panduan lengkap API dengan contoh |
| [POPULATE_ISSUE.md](docs/POPULATE_ISSUE.md) | ⚠️ **CRITICAL**: Jangan gunakan `populate=all`! |
| [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) | Solusi masalah umum |

### ⚠️ IMPORTANT: API Populate Warning

**JANGAN gunakan `populate=all`** - akan menyebabkan server stuck dan crash!

```bash
# ❌ DANGER - Server akan stuck!
GET /api/lembagas?populate=all

# ✅ SAFE - Gunakan selective populate
GET /api/lembagas?populate[santris]=true
```

📖 **Detail lengkap**: [POPULATE_ISSUE.md](docs/POPULATE_ISSUE.md)

### API Testing

```bash
# Test semua API endpoints (sudah safe, tanpa populate=all)
.\scripts\test-api.ps1
```

---

## 🔧 Troubleshooting

Mengalami masalah? Check [TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) untuk solusi:

- ❌ JavaScript Heap Out of Memory → ✅ **Sudah diperbaiki** dengan `--max-old-space-size=4096`
- ❌ 400 Bad Request pada filter → Check collection naming & filter syntax
- ❌ Empty data response → Check `publishedAt` dan relasi
- ❌ TypeScript compilation error → Check enum types

**Quick Fix untuk Memory Issue:**
```json
// Sudah diterapkan di package.json
"develop": "node --max-old-space-size=4096 node_modules/@strapi/strapi/bin/strapi.js develop"
```

---

## 📖 Commands

### Development

```bash
npm run develop          # Start dev server (autoReload enabled)
npm run seed:example     # Run seeder untuk sample data
```

### Production

```bash
npm run build           # Build admin panel
npm run start           # Start production server (autoReload disabled)
```

### Testing

```bash
.\scripts\test-api.ps1  # Test API endpoints (PowerShell)
```

### Strapi CLI

```bash
npm run strapi          # Strapi CLI commands
npm run console         # Strapi console
npm run deploy          # Deploy to Strapi Cloud
```

---

## 🗄️ Database

Project ini menggunakan **SQLite** untuk development:

- **Location**: `.tmp/data.db`
- **Records**: ~8,200 seeded records
  - 50 Staff/Guru
  - 200 Santri
  - 100 Prestasi
  - 80 Pelanggaran
  - 7,500 Kehadiran (Santri + Guru)

**Backup Database:**
```bash
# PowerShell
Copy-Item .tmp/data.db .tmp/data.backup.db
```

---

## 🏗️ Project Structure

```
my-strapi-project/
├── config/              # Strapi configuration
├── database/           # Database migrations
├── data/               # Seed data (uploads, JSON)
├── docs/               # Documentation
│   ├── API_ENDPOINTS.md
│   ├── SCHEMA_RELATIONSHIPS.md
│   └── TROUBLESHOOTING.md
├── scripts/            # Utility scripts
│   ├── ponpes.seed.ts  # Main seeder
│   └── test-api.ps1    # API testing script
├── src/
│   ├── api/           # API endpoints (10 entities)
│   ├── admin/         # Admin panel customization
│   ├── components/    # Reusable components
│   └── index.ts       # Entry point
└── public/            # Static files & uploads
```

---

## 🔌 API Endpoints

Base URL: `http://localhost:1337/api`

### Main Endpoints

| Endpoint | Description |
|----------|-------------|
| `/lembagas` | Lembaga pendidikan |
| `/santris` | Data santri |
| `/staffs` | Data staff/guru |
| `/kelass` | Kelas (double s!) |
| `/tahun-ajarans` | Tahun ajaran |
| `/riwayat-kelass` | Riwayat kelas santri |
| `/prestasis` | Prestasi santri |
| `/pelanggarans` | Pelanggaran santri |
| `/kehadiran-santris` | Kehadiran santri |
| `/kehadiran-gurus` | Kehadiran guru |

**Contoh Query:**
```
GET /api/santris?filters[lembaga][slug][$eq]=madrasah-aliyah-putri&filters[riwayatKelas][tahunAjaran][aktif][$eq]=true
```

📖 **Dokumentasi lengkap**: [API_ENDPOINTS.md](docs/API_ENDPOINTS.md)

---

## 📚 Learn more

- [Resource center](https://strapi.io/resource-center) - Strapi resource center.
- [Strapi documentation](https://docs.strapi.io) - Official Strapi documentation.
- [Strapi tutorials](https://strapi.io/tutorials) - List of tutorials made by the core team and the community.
- [Strapi blog](https://strapi.io/blog) - Official Strapi blog containing articles made by the Strapi team and the community.
- [Changelog](https://strapi.io/changelog) - Find out about the Strapi product updates, new features and general improvements.

Feel free to check out the [Strapi GitHub repository](https://github.com/strapi/strapi). Your feedback and contributions are welcome!

## ✨ Community

- [Discord](https://discord.strapi.io) - Come chat with the Strapi community including the core team.
- [Forum](https://forum.strapi.io/) - Place to discuss, ask questions and find answers, show your Strapi project and get feedback or just talk with other Community members.
- [Awesome Strapi](https://github.com/strapi/awesome-strapi) - A curated list of awesome things related to Strapi.

---

<sub>🤫 Psst! [Strapi is hiring](https://strapi.io/careers).</sub>
