# 🌱 Seeder Guide - Strapi Ponpes

Dokumentasi lengkap untuk menggunakan seeder data sample.

---

## 📦 What's Included

Ada 2 seeder yang tersedia:

### 1. **lembaga.seed.ts** (Existing)
- **Run:** `RUN_SEED=lembaga npm run develop`
- **Data:** 45+ lembaga (struktural, formal, informal)

### 2. **ponpes.seed.ts** (Baru)
- **Run:** `RUN_SEED=ponpes npm run develop`
- **Data:** Semua entity lain (santri, staff, kelas, prestasi, dll)

---

## 🚀 Quick Start

```powershell
# 1. Seed Lembaga (wajib duluan)
$env:RUN_SEED = "lembaga"
npm run develop
# Ctrl+C setelah selesai

# 2. Seed Entity Lainnya
$env:RUN_SEED = "ponpes"
npm run develop
# Ctrl+C setelah selesai

# 3. Jalankan tanpa seeder
Remove-Item Env:RUN_SEED
npm run develop
```

---

## 📦 Data yang Dibuat (ponpes.seed.ts)

### 📅 **9 Tahun Ajaran**:
- 2020/2021 Ganjil & Genap
- 2021/2022 Ganjil & Genap
- 2022/2023 Ganjil & Genap
- 2023/2024 Ganjil & Genap
- **2024/2025 Ganjil (ACTIVE)** ✅

### 🏫 **36+ Kelas**:
- MTs: Kelas 7-9 (A, B, C)
- MA: Kelas 10-12 (IPA, IPS)
- MI: Kelas 1-6
- SD: Kelas 1-6
- Madrasah Diniyah: Ula, Wustho, Ulya
- PAUD: Kelompok A, B
- TPA: Kelas 1-4

### 👨‍� **50 Staff/Guru**:
- Gender: L/P (50:50)
- Kategori: Guru (70%), Pengurus (20%), Staff (10%)
- Aktif: 90%, Non-aktif: 10%
- Tempat Lahir: 10+ kota Indonesia
- Tanggal Lahir: 1970-1995

### 👨‍🎓 **200 Santri**:
- Gender: L/P (60:40)
- Lembaga: Distribusi merata (formal 50%, diniyah 30%, struktural 20%)
- NIK: 16 digit, NISN: 10 digit
- Tempat Lahir: 10+ kota Indonesia
- Tanggal Lahir: 2005-2017
- Agama: ISLAM (95%), KRISTEN (3%), KATOLIK (2%)
- Alumni: 20%, Aktif: 80%

### 📝 **200 Riwayat Kelas**:
- Setiap santri memiliki 1 riwayat kelas
- Status: AKTIF (non-alumni), LULUS (alumni)
- Auto-populate kelasAktif & tahunAjaranAktif via lifecycle

### 🏆 **100 Prestasi**:
- Bidang: Akademik, Olahraga, Seni, Tahfidz, Bahasa
- Tingkat: Sekolah → Internasional
- Peringkat: Juara 1-3, Harapan 1-3
- Tahun: 2020-2024

### ⚠️ **80 Pelanggaran**:
- Kategori: Ringan (60%), Sedang (30%), Berat (10%)
- Jenis: Terlambat, bolos, merokok, berkelahi
- Sanksi: Teguran, denda, panggilan ortu, skorsing
- Tanggal: 30 hari terakhir

### 📊 **1,500 Kehadiran Guru**:
- 50 staff × 30 hari = 1500 records
- HADIR: 85%, SAKIT: 5%, IZIN: 5%, ALPHA: 5%
- Periode: 30 hari terakhir

### 📊 **6,000 Kehadiran Santri**:
- 24 hari kerja (September 2024)
- Hanya santri aktif (bukan alumni)
- 65% HADIR, sisanya SAKIT/IZIN/ALPHA

---

## 🚀 How to Run

### Method 1: Using Environment Variable (Recommended)

```bash
# Windows PowerShell
$env:RUN_SEED="ponpes"; npm run develop

# Windows CMD
set RUN_SEED=ponpes && npm run develop

# Linux/Mac
RUN_SEED=ponpes npm run develop
```

Server akan start dan menjalankan seeder otomatis saat bootstrap.

---

### Method 2: Edit .env File

Add to `.env`:
```env
RUN_SEED=ponpes
```

Then run:
```bash
npm run develop
```

**⚠️ Remember to remove or change after seeding!**

---

## 📋 What Happens When You Run

```
🌱 Starting Ponpes Data Seeding...

📚 Creating Lembaga (Institutions)...
✅ Created 3 lembaga

📅 Creating Tahun Ajaran (Academic Years)...
✅ Created 4 tahun ajaran

🎓 Creating Kelas (Classes)...
✅ Created 15 kelas

👨‍🏫 Creating Staff/Guru...
✅ Created 9 staff

👨‍🎓 Creating Santri (Students)...
✅ Created 90 santri

📝 Creating Riwayat Kelas (Enrollment History)...
✅ Created 90 riwayat kelas

🏆 Creating Prestasi (Achievements)...
✅ Created 27 prestasi

⚠️  Creating Pelanggaran (Violations)...
✅ Created 18 pelanggaran

📊 Creating Kehadiran Guru (Teacher Attendance)...
✅ Created 280 kehadiran guru

📊 Creating Kehadiran Santri (Student Attendance)...
✅ Created 2160 kehadiran santri

🎉 Ponpes Data Seeding Complete!

📈 Summary:
   • 3 Lembaga
   • 4 Tahun Ajaran
   • 15 Kelas
   • 9 Staff/Guru
   • 90 Santri
   • 90 Riwayat Kelas
   • 27 Prestasi
   • 18 Pelanggaran
   • 280 Kehadiran Guru
   • 2160 Kehadiran Santri

✨ You can now access the admin panel and see the data!
```

---

## ⏱️ Execution Time

Estimated time: **2-3 minutes** depending on your system.

The seeder will:
1. ✅ Check if data already exists (prevents duplicate)
2. ✅ Create entities in correct order (respecting dependencies)
3. ✅ Trigger lifecycle hooks (auto-populate kelasAktif, etc.)
4. ✅ Generate realistic sample data

---

## 🔍 Verifying the Data

After seeding, access admin panel: `http://localhost:1337/admin`

### Check Lembaga:
```
Content Manager → Lembaga
Should see: MI Al-Hikmah, MTs Al-Hikmah, MA Al-Hikmah
```

### Check Santri with Auto-Populated Fields:
```
Content Manager → Santri
Pick any santri → Check fields:
- kelasAktif: Should be populated (e.g., "Kelas 1")
- tahunAjaranAktif: Should be "2024/2025"
- isAlumni: Most are false, some true
```

### Check Alumni:
```
Content Manager → Santri → Add Filter
Filter: isAlumni = true
Should see: ~6 alumni santri (MA students marked as LULUS)
```

### Check Kehadiran:
```
Content Manager → Kehadiran Santri
Should see: ~2,160 entries (90 santri × 24 days)
Filter by tanggal or santri to see attendance records
```

---

## 🔄 Re-Seeding

### If You Want to Re-Seed:

1. **Delete all data** from admin panel (or drop database)
2. **Restart server** with `RUN_SEED=ponpes`

### Automatic Skip:

If data already exists, seeder will **automatically skip** with message:
```
⚠️  Data already exists. Skipping seed...
💡 To reseed, delete all data first from admin panel.
```

---

## 🎯 Sample Queries After Seeding

### Get All Santri in MI Al-Hikmah
```javascript
GET /api/santris?filters[lembaga][slug][$eq]=mi-al-hikmah&populate[lembaga]=*
```

### Get Alumni Only
```javascript
GET /api/santris?filters[isAlumni][$eq]=true
```

### Get Santri Kelas 1 Active
```javascript
GET /api/santris?filters[kelasAktif][$eq]=Kelas 1&filters[isAlumni][$eq]=false
```

### Get Prestasi Tingkat Nasional
```javascript
GET /api/prestasis?filters[tingkat][$eq]=Nasional&populate[santri]=*
```

### Get Kehadiran Santri September 2024
```javascript
GET /api/kehadiran-santris?filters[tanggal][$gte]=2024-09-01&filters[tanggal][$lte]=2024-09-30
```

---

## 📊 Data Distribution

### Santri per Lembaga:
- **MI**: 30 santri (5 per kelas × 6 kelas)
- **MTs**: 30 santri (10 per kelas × 3 kelas)
- **MA**: 30 santri (5 per kelas × 6 kelas)

### Gender Distribution:
- **50% Laki-laki** (L)
- **50% Perempuan** (P)

### Status Distribution:
- **80% AKTIF** (72 santri)
- **20% LULUS** (18 santri alumni)

### Prestasi Distribution:
- **30% santri** have achievements (~27 prestasi)
- Tingkat: Kecamatan, Kabupaten/Kota, Provinsi, Nasional

### Pelanggaran Distribution:
- **20% santri** have violations (~18 pelanggaran)
- Jenis: Terlambat, Tidak Mengerjakan Tugas, Ribut, dll

### Kehadiran Distribution:
- **Guru**: 70% HADIR, 30% SAKIT/IZIN
- **Santri**: 65% HADIR, 35% SAKIT/IZIN/ALPHA

---

## 🧪 Testing Lifecycle Behavior

After seeding, you can test lifecycle hooks:

### Test 1: Verify kelasAktif Auto-Populated
```bash
GET /api/santris?fields[0]=nama&fields[1]=kelasAktif&fields[2]=tahunAjaranAktif
```
All santri should have `kelasAktif` and `tahunAjaranAktif` populated!

### Test 2: Verify isAlumni Auto-Set
```bash
GET /api/santris?filters[isAlumni][$eq]=true
```
Should return santri with statusSantri = "LULUS" in riwayat-kelas

### Test 3: Create New Riwayat-Kelas
```bash
POST /api/riwayat-kelass
{
  "data": {
    "santri": 1,
    "kelas": 2,
    "tahunAjaran": 4,
    "statusSantri": "AKTIF"
  }
}
```
Check santri → kelasAktif should update automatically!

---

## 🎨 Customizing Seeder

Edit `scripts/seed-ponpes.js` to customize:

### Change Number of Santri:
```javascript
// Line ~180
for (let i = 0; i < 30; i++) { // Change 30 to your desired number
```

### Change Status Distribution:
```javascript
// Line ~360
const statusOptions = ['AKTIF', 'AKTIF', 'AKTIF', 'AKTIF', 'LULUS']; 
// Adjust ratio as needed
```

### Change Date Range:
```javascript
// Line ~410 (Kehadiran)
const workingDays = 20; // Change to generate more/less days
const tanggal = `2024-09-${day.toString().padStart(2, '0')}`; // Change month
```

---

## ⚠️ Important Notes

### Lifecycle Hooks Will Execute:
- ✅ RiwayatKelas.afterCreate → Updates santri.kelasAktif, tahunAjaranAktif
- ✅ RiwayatKelas.afterUpdate (LULUS) → Sets isAlumni, tahunLulus
- ✅ All auto-population will work as designed!

### Performance:
- Creating ~2,700+ entities takes 2-3 minutes
- Database will grow to ~5-10 MB
- Suitable for development/testing

### Database Support:
- ✅ SQLite (default)
- ✅ PostgreSQL
- ✅ MySQL
- ✅ Any Strapi-supported database

---

## 🐛 Troubleshooting

### Error: "Data already exists"
**Solution**: Delete all data from admin panel first, then reseed.

### Error: "Cannot find module"
**Solution**: Run `npm install` to ensure all dependencies installed.

### Seeder not running
**Solution**: 
1. Check `RUN_SEED=ponpes` is set correctly
2. Check server logs for errors
3. Ensure `src/index.ts` imports the seeder

### Lifecycle not triggered
**Solution**: Check that lifecycle files exist in entity folders:
- `src/api/riwayat-kelas/content-types/riwayat-kelas/lifecycles.ts`
- `src/api/tahun-ajaran/content-types/tahun-ajaran/lifecycles.ts`

---

## 📚 Related Documentation

- [DATA_INPUT_WORKFLOW.md](./DATA_INPUT_WORKFLOW.md) - Manual input guide
- [API_QUERY_EXAMPLES.md](./API_QUERY_EXAMPLES.md) - Query the seeded data
- [SCHEMA_RELATIONSHIPS.md](./SCHEMA_RELATIONSHIPS.md) - Understand data structure

---

## 🎉 Ready to Go!

After seeding, you'll have a **fully functional pesantren management system** with realistic sample data for:

✅ Testing frontend integrations  
✅ Demonstrating to stakeholders  
✅ Training users on the system  
✅ Validating queries and reports  
✅ Testing lifecycle behavior  

**Happy coding! 🚀**

---

Last Updated: October 1, 2025
