# 📋 Workflow Input Data - Strapi Ponpes

Dokumentasi lengkap cara input data ke sistem manajemen pesantren dengan urutan yang benar.

---

## 🎯 Urutan Input Data (WAJIB DIIKUTI!)

### 1️⃣ **Setup Awal** (Satu kali saja)

#### A. Buat Lembaga
**Collection**: `lembaga`

Input data lembaga/unit pendidikan terlebih dahulu:

```json
{
  "nama": "MI Al-Hikmah",
  "slug": "mi-al-hikmah",
  "profilMd": "### Madrasah Ibtidaiyah...",
  "programKerjaMd": "### Program Kerja...",
  "frontImages": [...],
  "kontak": [...]
}
```

**📌 Catatan**: 
- Slug otomatis dibuat dari nama
- Semua data santri, staff, kelas akan terikat ke lembaga ini
- Bisa buat multiple lembaga untuk struktur pesantren yang kompleks

---

#### B. Buat Tahun Ajaran
**Collection**: `tahun-ajaran`

Buat tahun ajaran untuk periode aktif:

```json
{
  "tahunAjaran": "2024/2025",
  "semester": "Ganjil",
  "aktif": true
}
```

**📌 Catatan**: 
- Format tahun ajaran: `YYYY/YYYY` dengan regex `^\d{4}/\d{4}$`
- Semester: "Ganjil" atau "Genap"
- **HANYA BOLEH 1 tahun ajaran aktif** (aktif: true)
- Lifecycle akan otomatis menonaktifkan tahun ajaran lain saat ada yang diaktifkan
- Tahun ajaran tidak bisa dihapus jika masih ada riwayat kelas yang menggunakannya

**⚠️ PENTING**: Buat tahun ajaran dulu sebelum input santri!

---

#### C. Buat Kelas
**Collection**: `kelas`

Buat kelas/tingkat yang tersedia:

```json
{
  "kelas": "Kelas 1",
  "lembaga": <relation_to_lembaga_id>
}
```

**📌 Contoh kelas**:
- MI: "Kelas 1", "Kelas 2", ... "Kelas 6"
- MTs: "Kelas 7", "Kelas 8", "Kelas 9"
- MA: "Kelas 10", "Kelas 11 IPA", "Kelas 11 IPS", "Kelas 12 IPA"

**📌 Catatan**: 
- Kelas field adalah string bebas, sesuaikan dengan struktur lembaga
- Harus pilih lembaga yang sudah dibuat

---

### 2️⃣ **Input Personil**

#### D. Input Staff/Guru
**Collection**: `staff`

Input data guru dan staff sebelum bisa mencatat kehadiran:

```json
{
  "nama": "Ustadz Ahmad",
  "nip": "123456789",
  "gender": "L",
  "kategoriPersonil": "GURU",
  "lembaga": <relation_to_lembaga_id>,
  "aktif": true,
  "tempatLahir": "Jakarta",
  "tanggalLahir": "1990-01-15",
  "agama": "ISLAM",
  "keteranganTugas": "Guru Matematika"
}
```

**📌 Field Options**:
- `gender`: "L" atau "P"
- `kategoriPersonil`: "GURU", "PENGURUS", atau "STAFF"
- `agama`: "ISLAM" (bisa diperluas di schema)

---

### 3️⃣ **Input Santri**

#### E. Input Data Santri
**Collection**: `santri`

Input biodata santri terlebih dahulu:

```json
{
  "nama": "Ahmad Zaki",
  "nisn": "0123456789",
  "lembaga": <relation_to_lembaga_id>,
  "gender": "L",
  "tempatLahir": "Surabaya",
  "tanggalLahir": "2010-05-20",
  "namaAyah": "Bapak Ahmad",
  "namaIbu": "Ibu Siti",
  "kelurahan": "Sidoarjo",
  "kecamatan": "Waru",
  "kota": "Surabaya",
  "tahunMasuk": "2020"
}
```

**📌 Field yang AUTO-POPULATE**:
- `kelasAktif`: Otomatis terisi dari riwayat-kelas (string nama kelas)
- `tahunAjaranAktif`: Otomatis terisi dari riwayat-kelas (string tahun ajaran)
- `isAlumni`: Otomatis jadi `true` saat statusSantri di riwayat-kelas = "LULUS"
- `tahunLulus`: Otomatis terisi saat statusSantri = "LULUS"

**⚠️ JANGAN INPUT MANUAL**:
- `kelasAktif` 
- `tahunAjaranAktif`
- `isAlumni`
- `tahunLulus`

Field ini dikelola oleh **lifecycle hooks** dari `riwayat-kelas`!

---

#### F. Daftarkan Santri ke Kelas (WAJIB!)
**Collection**: `riwayat-kelas`

Setelah santri ada, daftarkan ke kelas:

```json
{
  "santri": <relation_to_santri_id>,
  "kelas": <relation_to_kelas_id>,
  "tahunAjaran": <relation_to_tahun_ajaran_id>,
  "statusSantri": "AKTIF",
  "tanggalMulai": "2024-07-15",
  "tanggalSelesai": null,
  "catatan": "Siswa baru masuk"
}
```

**📌 Status Santri Options**:
- `AKTIF`: Santri masih aktif di kelas ini
- `NAIK_KELAS`: Naik ke kelas berikutnya
- `PINDAH`: Pindah ke lembaga lain
- `KELUAR`: Keluar/DO
- `LULUS`: Lulus/alumni

**🔄 Lifecycle yang Terjadi**:
1. **afterCreate**: 
   - Query kelas untuk dapat nama kelas (string)
   - Query tahunAjaran untuk dapat string "2024/2025"
   - Update santri: set `kelasAktif` dan `tahunAjaranAktif`
   - Set `tahunMasuk` di santri jika belum ada

2. **afterUpdate** (saat ubah status jadi "LULUS"):
   - Set santri `isAlumni = true`
   - Set `tahunLulus` dari tahun ajaran saat ini

**📌 Contoh Workflow Santri Naik Kelas**:

```javascript
// Tahun 2024/2025 - Santri di Kelas 1
{
  santri: santriId,
  kelas: kelas1Id,
  tahunAjaran: ta2024Id,
  statusSantri: "NAIK_KELAS", // Ubah status jadi NAIK_KELAS
  tanggalSelesai: "2025-06-30"
}

// Tahun 2025/2026 - Buat entry baru untuk Kelas 2
{
  santri: santriId,
  kelas: kelas2Id,
  tahunAjaran: ta2025Id,
  statusSantri: "AKTIF",
  tanggalMulai: "2025-07-15"
}
// kelasAktif santri otomatis update ke "Kelas 2"
```

---

### 4️⃣ **Input Data Kehadiran**

#### G. Kehadiran Guru
**Collection**: `kehadiran-guru`

Catat kehadiran guru per kelas:

```json
{
  "staff": <relation_to_staff_id>,
  "kelas": <relation_to_kelas_id>,
  "tahunAjaran": <relation_to_tahun_ajaran_id>,
  "tanggal": "2024-09-15",
  "jenis": "HADIR",
  "keterangan": "Mengajar jam 1-2"
}
```

**📌 Jenis Kehadiran**:
- `HADIR`: Guru hadir
- `SAKIT`: Sakit
- `IZIN`: Izin
- `ALPHA`: Tanpa keterangan

**📌 Catatan**:
- Kehadiran guru terikat ke **kelas + tahunAjaran** (bukan riwayat-kelas)
- Satu guru bisa mengajar di multiple kelas
- Query: Filter by staff + kelas + tahunAjaran

---

#### H. Kehadiran Santri
**Collection**: `kehadiran-santri`

Catat kehadiran santri:

```json
{
  "santri": <relation_to_santri_id>,
  "riwayatKelas": <relation_to_riwayat_kelas_id>,
  "tanggal": "2024-09-15",
  "jenis": "HADIR",
  "keterangan": "Hadir tepat waktu"
}
```

**📌 Jenis Kehadiran**:
- `HADIR`: Hadir
- `SAKIT`: Sakit
- `IZIN`: Izin dengan surat
- `ALPHA`: Tanpa keterangan

**📌 Catatan**:
- Kehadiran santri terikat ke **riwayat-kelas** (bukan langsung ke kelas)
- Ini memastikan kehadiran tercatat sesuai periode enrollment
- Query: Filter by santri + riwayatKelas untuk dapat kehadiran di periode tertentu

---

### 5️⃣ **Input Prestasi & Pelanggaran**

#### I. Input Prestasi Santri
**Collection**: `prestasi`

```json
{
  "santri": <relation_to_santri_id>,
  "namaLomba": "Olimpiade Matematika",
  "penyelenggara": "Kemenag",
  "tingkat": "Kabupaten/Kota",
  "peringkat": "Juara 1",
  "bidang": "Matematika",
  "tahun": "2024"
}
```

**📌 Tingkat Options**:
- "Sekolah"
- "Kecamatan"
- "Kabupaten/Kota"
- "Provinsi"
- "Nasional"
- "Internasional"

**📌 Peringkat Options**:
- "Juara 1", "Juara 2", "Juara 3"
- "Harapan 1", "Harapan 2", "Harapan 3"

---

#### J. Input Pelanggaran Santri
**Collection**: `pelanggaran`

```json
{
  "santri": <relation_to_santri_id>,
  "jenis": "Terlambat",
  "poin": 5,
  "tanggal": "2024-09-15",
  "keterangan": "Terlambat masuk kelas 30 menit"
}
```

**📌 Contoh Jenis Pelanggaran**:
- Terlambat (poin: 5)
- Tidak mengerjakan tugas (poin: 10)
- Berkelahi (poin: 50)
- Kabur (poin: 100)

---

## 🔍 Query Patterns untuk Frontend

### Search Santri per Lembaga

```javascript
// All santri dalam satu lembaga
const { data } = await fetch('/api/santris?filters[lembaga][id][$eq]=1&populate=*');

// Santri aktif (bukan alumni)
const { data } = await fetch('/api/santris?filters[lembaga][id][$eq]=1&filters[isAlumni][$eq]=false');

// Alumni saja
const { data } = await fetch('/api/santris?filters[lembaga][id][$eq]=1&filters[isAlumni][$eq]=true');

// Santri di kelas tertentu (aktif)
const { data } = await fetch('/api/santris?filters[kelasAktif][$eq]=Kelas 1&filters[lembaga][id][$eq]=1');

// Search by nama
const { data } = await fetch('/api/santris?filters[nama][$containsi]=ahmad&filters[lembaga][id][$eq]=1');
```

---

### Search Staff per Lembaga

```javascript
// All staff dalam lembaga
const { data } = await fetch('/api/staffs?filters[lembaga][id][$eq]=1&populate=*');

// Staff aktif saja
const { data } = await fetch('/api/staffs?filters[lembaga][id][$eq]=1&filters[aktif][$eq]=true');

// Filter by kategori
const { data } = await fetch('/api/staffs?filters[kategoriPersonil][$eq]=GURU&filters[lembaga][id][$eq]=1');

// Search by nama
const { data } = await fetch('/api/staffs?filters[nama][$containsi]=ahmad&filters[lembaga][id][$eq]=1');
```

---

### Search Prestasi per Lembaga

```javascript
// Prestasi santri dalam lembaga (via santri relation)
const { data } = await fetch('/api/prestasis?filters[santri][lembaga][id][$eq]=1&populate[santri][populate]=lembaga');

// Prestasi tingkat tertentu
const { data } = await fetch('/api/prestasis?filters[tingkat][$eq]=Nasional&filters[santri][lembaga][id][$eq]=1');

// Prestasi tahun tertentu
const { data } = await fetch('/api/prestasis?filters[tahun][$eq]=2024&filters[santri][lembaga][id][$eq]=1');
```

---

### Search Pelanggaran per Lembaga

```javascript
// Pelanggaran dalam lembaga (via santri relation)
const { data } = await fetch('/api/pelanggarans?filters[santri][lembaga][id][$eq]=1&populate[santri][populate]=lembaga');

// Pelanggaran jenis tertentu
const { data } = await fetch('/api/pelanggarans?filters[jenis][$eq]=Terlambat&filters[santri][lembaga][id][$eq]=1');

// Pelanggaran range tanggal
const { data } = await fetch('/api/pelanggarans?filters[tanggal][$gte]=2024-01-01&filters[tanggal][$lte]=2024-12-31&filters[santri][lembaga][id][$eq]=1');
```

---

### Search Kehadiran

```javascript
// Kehadiran santri per bulan
const { data } = await fetch('/api/kehadiran-santris?filters[santri][id][$eq]=1&filters[tanggal][$gte]=2024-09-01&filters[tanggal][$lte]=2024-09-30&populate=*');

// Kehadiran guru per kelas
const { data } = await fetch('/api/kehadiran-gurus?filters[staff][id][$eq]=1&filters[kelas][id][$eq]=1&filters[tahunAjaran][id][$eq]=1&populate=*');

// Rekapitulasi kehadiran santri di riwayat kelas tertentu
const { data } = await fetch('/api/kehadiran-santris?filters[riwayatKelas][id][$eq]=1&populate=*');
```

---

### Search Riwayat Kelas Santri

```javascript
// Riwayat kelas satu santri
const { data } = await fetch('/api/riwayat-kelass?filters[santri][id][$eq]=1&populate[kelas]=*&populate[tahunAjaran]=*&sort=tanggalMulai:desc');

// Santri aktif di kelas tertentu
const { data } = await fetch('/api/riwayat-kelass?filters[kelas][id][$eq]=1&filters[statusSantri][$eq]=AKTIF&populate[santri]=*');

// Alumni tahun tertentu
const { data } = await fetch('/api/riwayat-kelass?filters[statusSantri][$eq]=LULUS&filters[tahunAjaran][tahunAjaran][$eq]=2023/2024&populate=*');
```

---

### Search Keseluruhan (Semua Lembaga)

```javascript
// Semua santri (tanpa filter lembaga)
const { data } = await fetch('/api/santris?populate=lembaga');

// Semua prestasi tingkat nasional
const { data } = await fetch('/api/prestasis?filters[tingkat][$eq]=Nasional&populate[santri][populate]=lembaga');

// Semua alumni
const { data } = await fetch('/api/santris?filters[isAlumni][$eq]=true&populate=lembaga');
```

---

## 📊 Pagination & Sorting

```javascript
// Pagination
const { data, meta } = await fetch('/api/santris?pagination[page]=1&pagination[pageSize]=25');

// Sorting
const { data } = await fetch('/api/santris?sort=nama:asc');
const { data } = await fetch('/api/santris?sort[0]=kelasAktif:asc&sort[1]=nama:asc');

// Complex query
const { data } = await fetch(`
  /api/santris?
  filters[lembaga][id][$eq]=1&
  filters[isAlumni][$eq]=false&
  filters[kelasAktif][$eq]=Kelas 1&
  populate[prestasis]=*&
  populate[pelanggarans]=*&
  populate[riwayatKelas][populate][kelas]=*&
  pagination[pageSize]=10&
  sort=nama:asc
`);
```

---

## ⚠️ Validasi & Error Prevention

### ❌ JANGAN LAKUKAN INI:

1. **Input santri tanpa lembaga** → Error
2. **Buat riwayat-kelas tanpa tahun ajaran** → kelasAktif tidak terupdate
3. **Edit manual field `kelasAktif` di santri** → Akan tertimpa lifecycle
4. **Edit manual field `isAlumni`** → Akan tertimpa lifecycle
5. **Hapus tahun ajaran yang masih dipakai** → Lifecycle akan cegah dengan error
6. **Aktifkan 2 tahun ajaran bersamaan** → Lifecycle akan otomatis nonaktifkan yang lain

### ✅ BEST PRACTICES:

1. **Selalu buat Lembaga → Tahun Ajaran → Kelas dulu**
2. **Buat santri, baru daftarkan ke riwayat-kelas**
3. **Gunakan statusSantri untuk track lifecycle santri**
4. **Jangan edit shortcut fields** (`kelasAktif`, `tahunAjaranAktif`, `isAlumni`)
5. **Buat entry riwayat-kelas baru saat naik kelas**, jangan edit yang lama
6. **Backup database sebelum import bulk data**

---

## 🎓 Contoh Workflow Lengkap

### Skenario: Input Santri Baru

```javascript
// 1. Pastikan sudah ada: Lembaga, Tahun Ajaran, Kelas

// 2. Create santri
POST /api/santris
{
  "data": {
    "nama": "Ahmad Zaki",
    "nisn": "0123456789",
    "lembaga": 1, // ID lembaga
    "gender": "L",
    "tempatLahir": "Surabaya",
    "tanggalLahir": "2010-05-20",
    "tahunMasuk": "2024"
  }
}
// Response: { data: { id: 15, ... } }

// 3. Daftarkan ke kelas (LIFECYCLE AKAN JALAN!)
POST /api/riwayat-kelass
{
  "data": {
    "santri": 15, // ID santri dari step 2
    "kelas": 3,   // ID kelas "Kelas 1"
    "tahunAjaran": 2, // ID tahun ajaran "2024/2025"
    "statusSantri": "AKTIF",
    "tanggalMulai": "2024-07-15"
  }
}
// Lifecycle otomatis:
// - Update santri.kelasAktif = "Kelas 1"
// - Update santri.tahunAjaranAktif = "2024/2025"

// 4. Verify
GET /api/santris/15
// Response:
// {
//   "data": {
//     "id": 15,
//     "nama": "Ahmad Zaki",
//     "kelasAktif": "Kelas 1",  ← AUTO!
//     "tahunAjaranAktif": "2024/2025", ← AUTO!
//     "isAlumni": false,
//     ...
//   }
// }
```

---

## 📝 Summary Checklist

Sebelum mulai input data:

- [ ] Lembaga sudah dibuat
- [ ] Tahun Ajaran aktif sudah ada
- [ ] Kelas-kelas sudah dibuat
- [ ] Staff/Guru sudah diinput (jika perlu)
- [ ] Pahami lifecycle auto-populate
- [ ] Jangan edit manual shortcut fields
- [ ] Gunakan filter lembaga untuk multi-unit

**Happy coding! 🚀**
