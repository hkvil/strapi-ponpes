# 🔍 API Query Examples - Strapi Ponpes

Dokumentasi lengkap query API untuk frontend dengan contoh request dan response.

---

## 📦 Base URL

```
Development: http://localhost:1337/api
Production: https://your-domain.com/api
```

---

## 🔐 Authentication

Untuk public API (jika diset), tidak perlu auth. Untuk admin/protected:

```javascript
const response = await fetch('/api/santris', {
  headers: {
    'Authorization': 'Bearer YOUR_JWT_TOKEN',
    'Content-Type': 'application/json'
  }
});
```

---

## 1️⃣ Query Santri

### Get All Santri dengan Populate

```javascript
// Basic
GET /api/santris?populate=*

// Selective populate (lebih efisien)
GET /api/santris?populate[lembaga]=*&populate[riwayatKelas][populate][kelas]=*
```

**Response Example**:
```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123",
      "nama": "Ahmad Zaki",
      "nisn": "0123456789",
      "kelasAktif": "Kelas 1",
      "tahunAjaranAktif": "2024/2025",
      "isAlumni": false,
      "gender": "L",
      "tempatLahir": "Surabaya",
      "tanggalLahir": "2010-05-20",
      "tahunMasuk": "2024",
      "lembaga": {
        "id": 1,
        "nama": "MI Al-Hikmah",
        "slug": "mi-al-hikmah"
      },
      "riwayatKelas": [
        {
          "id": 1,
          "statusSantri": "AKTIF",
          "tanggalMulai": "2024-07-15",
          "kelas": {
            "id": 3,
            "kelas": "Kelas 1"
          }
        }
      ]
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 4,
      "total": 100
    }
  }
}
```

---

### Filter Santri by Lembaga

```javascript
// Santri di lembaga tertentu
GET /api/santris?filters[lembaga][id][$eq]=1

// Dengan nama lembaga
GET /api/santris?filters[lembaga][slug][$eq]=mi-al-hikmah
```

---

### Filter Santri Aktif vs Alumni

```javascript
// Santri aktif (bukan alumni)
GET /api/santris?filters[isAlumni][$eq]=false&filters[lembaga][id][$eq]=1

// Alumni saja
GET /api/santris?filters[isAlumni][$eq]=true&filters[lembaga][id][$eq]=1
```

---

### Filter Santri by Kelas Aktif

```javascript
// Santri di kelas tertentu
GET /api/santris?filters[kelasAktif][$eq]=Kelas 1&filters[lembaga][id][$eq]=1

// Santri kelas 10 IPA
GET /api/santris?filters[kelasAktif][$eq]=Kelas 10 IPA
```

---

### Search Santri by Nama

```javascript
// Case-insensitive contains
GET /api/santris?filters[nama][$containsi]=ahmad

// Dengan filter lembaga
GET /api/santris?filters[nama][$containsi]=ahmad&filters[lembaga][id][$eq]=1

// Exact match
GET /api/santris?filters[nama][$eq]=Ahmad Zaki
```

---

### Filter Santri by Gender

```javascript
// Laki-laki
GET /api/santris?filters[gender][$eq]=L&filters[lembaga][id][$eq]=1

// Perempuan
GET /api/santris?filters[gender][$eq]=P&filters[lembaga][id][$eq]=1
```

---

### Filter Santri by Tahun Masuk

```javascript
// Angkatan 2024
GET /api/santris?filters[tahunMasuk][$eq]=2024&filters[lembaga][id][$eq]=1

// Angkatan 2020-2024
GET /api/santris?filters[tahunMasuk][$gte]=2020&filters[tahunMasuk][$lte]=2024
```

---

### Complex Query: Santri Aktif dengan Prestasi & Pelanggaran

```javascript
GET /api/santris?
  filters[lembaga][id][$eq]=1&
  filters[isAlumni][$eq]=false&
  filters[kelasAktif][$eq]=Kelas 1&
  populate[lembaga]=*&
  populate[prestasis][populate][0]=*&
  populate[pelanggarans][populate][0]=*&
  populate[riwayatKelas][populate][kelas]=*&
  populate[riwayatKelas][populate][tahunAjaran]=*&
  sort=nama:asc&
  pagination[pageSize]=10
```

---

## 2️⃣ Query Staff

### Get All Staff

```javascript
// All staff dengan populate
GET /api/staffs?populate[lembaga]=*&populate[kehadiran]=*
```

**Response Example**:
```json
{
  "data": [
    {
      "id": 1,
      "nama": "Ustadz Ahmad",
      "nip": "123456789",
      "gender": "L",
      "kategoriPersonil": "GURU",
      "aktif": true,
      "keteranganTugas": "Guru Matematika",
      "lembaga": {
        "id": 1,
        "nama": "MI Al-Hikmah"
      }
    }
  ]
}
```

---

### Filter Staff by Lembaga

```javascript
// Staff di lembaga tertentu
GET /api/staffs?filters[lembaga][id][$eq]=1&populate[lembaga]=*
```

---

### Filter Staff by Status Aktif

```javascript
// Staff aktif
GET /api/staffs?filters[aktif][$eq]=true&filters[lembaga][id][$eq]=1

// Staff non-aktif
GET /api/staffs?filters[aktif][$eq]=false&filters[lembaga][id][$eq]=1
```

---

### Filter Staff by Kategori

```javascript
// Hanya guru
GET /api/staffs?filters[kategoriPersonil][$eq]=GURU&filters[lembaga][id][$eq]=1

// Staff administrasi
GET /api/staffs?filters[kategoriPersonil][$eq]=STAFF

// Pengurus
GET /api/staffs?filters[kategoriPersonil][$eq]=PENGURUS
```

---

### Search Staff by Nama

```javascript
// Search nama staff
GET /api/staffs?filters[nama][$containsi]=ahmad&filters[lembaga][id][$eq]=1
```

---

## 3️⃣ Query Prestasi

### Get All Prestasi

```javascript
// All prestasi dengan santri
GET /api/prestasis?populate[santri][populate][lembaga]=*
```

**Response Example**:
```json
{
  "data": [
    {
      "id": 1,
      "namaLomba": "Olimpiade Matematika",
      "penyelenggara": "Kemenag",
      "tingkat": "Kabupaten/Kota",
      "peringkat": "Juara 1",
      "bidang": "Matematika",
      "tahun": "2024",
      "santri": {
        "id": 1,
        "nama": "Ahmad Zaki",
        "lembaga": {
          "id": 1,
          "nama": "MI Al-Hikmah"
        }
      }
    }
  ]
}
```

---

### Filter Prestasi by Lembaga (via Santri)

```javascript
// Prestasi santri di lembaga tertentu
GET /api/prestasis?filters[santri][lembaga][id][$eq]=1&populate[santri][populate][lembaga]=*
```

---

### Filter Prestasi by Tingkat

```javascript
// Prestasi tingkat nasional
GET /api/prestasis?filters[tingkat][$eq]=Nasional&filters[santri][lembaga][id][$eq]=1

// Tingkat kabupaten/kota
GET /api/prestasis?filters[tingkat][$eq]=Kabupaten/Kota

// Multiple tingkat (Nasional atau Internasional)
GET /api/prestasis?filters[$or][0][tingkat][$eq]=Nasional&filters[$or][1][tingkat][$eq]=Internasional
```

---

### Filter Prestasi by Tahun

```javascript
// Prestasi tahun 2024
GET /api/prestasis?filters[tahun][$eq]=2024&filters[santri][lembaga][id][$eq]=1

// Range tahun 2020-2024
GET /api/prestasis?filters[tahun][$gte]=2020&filters[tahun][$lte]=2024
```

---

### Filter Prestasi by Peringkat

```javascript
// Hanya Juara 1
GET /api/prestasis?filters[peringkat][$eq]=Juara 1&filters[santri][lembaga][id][$eq]=1

// Juara 1, 2, atau 3
GET /api/prestasis?filters[peringkat][$in]=Juara 1&filters[peringkat][$in]=Juara 2&filters[peringkat][$in]=Juara 3
```

---

### Prestasi Santri Tertentu

```javascript
// Prestasi satu santri
GET /api/prestasis?filters[santri][id][$eq]=1&populate[santri]=*
```

---

## 4️⃣ Query Pelanggaran

### Get All Pelanggaran

```javascript
// All pelanggaran dengan santri
GET /api/pelanggarans?populate[santri][populate][lembaga]=*
```

**Response Example**:
```json
{
  "data": [
    {
      "id": 1,
      "jenis": "Terlambat",
      "poin": 5,
      "tanggal": "2024-09-15",
      "keterangan": "Terlambat 30 menit",
      "santri": {
        "id": 1,
        "nama": "Ahmad Zaki",
        "lembaga": {
          "id": 1,
          "nama": "MI Al-Hikmah"
        }
      }
    }
  ]
}
```

---

### Filter Pelanggaran by Lembaga (via Santri)

```javascript
// Pelanggaran di lembaga tertentu
GET /api/pelanggarans?filters[santri][lembaga][id][$eq]=1&populate[santri][populate][lembaga]=*
```

---

### Filter Pelanggaran by Jenis

```javascript
// Pelanggaran jenis terlambat
GET /api/pelanggarans?filters[jenis][$containsi]=terlambat&filters[santri][lembaga][id][$eq]=1

// Exact match
GET /api/pelanggarans?filters[jenis][$eq]=Berkelahi
```

---

### Filter Pelanggaran by Tanggal

```javascript
// Pelanggaran hari ini
GET /api/pelanggarans?filters[tanggal][$eq]=2024-09-15

// Range tanggal (bulan September)
GET /api/pelanggarans?filters[tanggal][$gte]=2024-09-01&filters[tanggal][$lte]=2024-09-30&filters[santri][lembaga][id][$eq]=1

// Tahun 2024
GET /api/pelanggarans?filters[tanggal][$gte]=2024-01-01&filters[tanggal][$lte]=2024-12-31
```

---

### Filter Pelanggaran by Poin

```javascript
// Pelanggaran berat (poin >= 50)
GET /api/pelanggarans?filters[poin][$gte]=50&filters[santri][lembaga][id][$eq]=1

// Pelanggaran ringan (poin < 20)
GET /api/pelanggarans?filters[poin][$lt]=20
```

---

### Pelanggaran Santri Tertentu

```javascript
// Pelanggaran satu santri
GET /api/pelanggarans?filters[santri][id][$eq]=1&populate[santri]=*&sort=tanggal:desc
```

---

## 5️⃣ Query Riwayat Kelas

### Get All Riwayat Kelas

```javascript
// With full populate
GET /api/riwayat-kelass?populate[santri]=*&populate[kelas]=*&populate[tahunAjaran]=*
```

**Response Example**:
```json
{
  "data": [
    {
      "id": 1,
      "statusSantri": "AKTIF",
      "tanggalMulai": "2024-07-15",
      "tanggalSelesai": null,
      "catatan": "Siswa baru",
      "santri": {
        "id": 1,
        "nama": "Ahmad Zaki"
      },
      "kelas": {
        "id": 3,
        "kelas": "Kelas 1"
      },
      "tahunAjaran": {
        "id": 2,
        "tahunAjaran": "2024/2025",
        "semester": "Ganjil",
        "aktif": true
      }
    }
  ]
}
```

---

### Riwayat Kelas Santri Tertentu

```javascript
// Semua riwayat satu santri (urut terbaru)
GET /api/riwayat-kelass?filters[santri][id][$eq]=1&populate=*&sort=tanggalMulai:desc
```

---

### Santri Aktif di Kelas Tertentu

```javascript
// Daftar santri aktif di Kelas 1
GET /api/riwayat-kelass?filters[kelas][id][$eq]=3&filters[statusSantri][$eq]=AKTIF&populate[santri]=*

// Dengan tahun ajaran spesifik
GET /api/riwayat-kelass?filters[kelas][id][$eq]=3&filters[tahunAjaran][id][$eq]=2&filters[statusSantri][$eq]=AKTIF&populate=*
```

---

### Alumni Tahun Tertentu

```javascript
// Alumni lulus tahun 2023/2024
GET /api/riwayat-kelass?filters[statusSantri][$eq]=LULUS&filters[tahunAjaran][tahunAjaran][$eq]=2023/2024&populate[santri]=*
```

---

### Filter by Status Santri

```javascript
// Santri aktif
GET /api/riwayat-kelass?filters[statusSantri][$eq]=AKTIF&populate=*

// Santri yang pindah
GET /api/riwayat-kelass?filters[statusSantri][$eq]=PINDAH&populate=*

// Santri DO/keluar
GET /api/riwayat-kelass?filters[statusSantri][$eq]=KELUAR&populate=*

// Naik kelas
GET /api/riwayat-kelass?filters[statusSantri][$eq]=NAIK_KELAS&populate=*
```

---

## 6️⃣ Query Kehadiran Guru

### Get Kehadiran Guru

```javascript
// All kehadiran guru
GET /api/kehadiran-gurus?populate[staff]=*&populate[kelas]=*&populate[tahunAjaran]=*
```

**Response Example**:
```json
{
  "data": [
    {
      "id": 1,
      "tanggal": "2024-09-15",
      "jenis": "HADIR",
      "keterangan": "Mengajar jam 1-2",
      "staff": {
        "id": 1,
        "nama": "Ustadz Ahmad"
      },
      "kelas": {
        "id": 3,
        "kelas": "Kelas 1"
      },
      "tahunAjaran": {
        "id": 2,
        "tahunAjaran": "2024/2025"
      }
    }
  ]
}
```

---

### Kehadiran Guru Tertentu

```javascript
// Kehadiran satu guru
GET /api/kehadiran-gurus?filters[staff][id][$eq]=1&populate=*&sort=tanggal:desc

// Guru tertentu di kelas tertentu
GET /api/kehadiran-gurus?filters[staff][id][$eq]=1&filters[kelas][id][$eq]=3&populate=*
```

---

### Kehadiran by Tanggal

```javascript
// Kehadiran hari ini
GET /api/kehadiran-gurus?filters[tanggal][$eq]=2024-09-15&populate=*

// Kehadiran bulan September
GET /api/kehadiran-gurus?filters[tanggal][$gte]=2024-09-01&filters[tanggal][$lte]=2024-09-30&populate=*
```

---

### Kehadiran by Jenis

```javascript
// Guru yang sakit
GET /api/kehadiran-gurus?filters[jenis][$eq]=SAKIT&populate[staff]=*

// Guru yang alpha
GET /api/kehadiran-gurus?filters[jenis][$eq]=ALPHA&populate[staff]=*
```

---

## 7️⃣ Query Kehadiran Santri

### Get Kehadiran Santri

```javascript
// All kehadiran santri
GET /api/kehadiran-santris?populate[santri]=*&populate[riwayatKelas][populate][kelas]=*
```

**Response Example**:
```json
{
  "data": [
    {
      "id": 1,
      "tanggal": "2024-09-15",
      "jenis": "HADIR",
      "keterangan": "Hadir tepat waktu",
      "santri": {
        "id": 1,
        "nama": "Ahmad Zaki"
      },
      "riwayatKelas": {
        "id": 1,
        "kelas": {
          "id": 3,
          "kelas": "Kelas 1"
        }
      }
    }
  ]
}
```

---

### Kehadiran Santri Tertentu

```javascript
// Kehadiran satu santri
GET /api/kehadiran-santris?filters[santri][id][$eq]=1&populate=*&sort=tanggal:desc

// Kehadiran santri bulan ini
GET /api/kehadiran-santris?filters[santri][id][$eq]=1&filters[tanggal][$gte]=2024-09-01&filters[tanggal][$lte]=2024-09-30&populate=*
```

---

### Kehadiran by Riwayat Kelas

```javascript
// Kehadiran di riwayat kelas tertentu (periode tertentu)
GET /api/kehadiran-santris?filters[riwayatKelas][id][$eq]=1&populate=*
```

---

### Kehadiran by Jenis

```javascript
// Santri yang alpha
GET /api/kehadiran-santris?filters[jenis][$eq]=ALPHA&populate[santri]=*

// Santri yang sakit bulan ini
GET /api/kehadiran-santris?filters[jenis][$eq]=SAKIT&filters[tanggal][$gte]=2024-09-01&populate[santri]=*
```

---

## 8️⃣ Query Kelas

### Get All Kelas

```javascript
// All kelas dengan lembaga
GET /api/kelass?populate[lembaga]=*
```

---

### Kelas by Lembaga

```javascript
// Kelas di lembaga tertentu
GET /api/kelass?filters[lembaga][id][$eq]=1&populate[lembaga]=*
```

---

### Kelas dengan Santri Aktif (via Riwayat Kelas)

```javascript
// Kelas dengan jumlah santri
GET /api/kelass?populate[riwayatKelas][filters][statusSantri][$eq]=AKTIF
```

---

## 9️⃣ Query Tahun Ajaran

### Get All Tahun Ajaran

```javascript
// All tahun ajaran
GET /api/tahun-ajarans?sort=tahunAjaran:desc
```

**Response Example**:
```json
{
  "data": [
    {
      "id": 2,
      "tahunAjaran": "2024/2025",
      "semester": "Ganjil",
      "aktif": true
    },
    {
      "id": 1,
      "tahunAjaran": "2023/2024",
      "semester": "Genap",
      "aktif": false
    }
  ]
}
```

---

### Get Tahun Ajaran Aktif

```javascript
// Tahun ajaran yang sedang aktif
GET /api/tahun-ajarans?filters[aktif][$eq]=true
```

---

### Tahun Ajaran Tertentu

```javascript
// Get by tahunAjaran string
GET /api/tahun-ajarans?filters[tahunAjaran][$eq]=2024/2025
```

---

## 🔟 Query Lembaga

### Get All Lembaga

```javascript
// Basic
GET /api/lembagas

// With counts (santri, staff, kelas)
GET /api/lembagas?populate[santris][count]=true&populate[staffs][count]=true&populate[kelas][count]=true
```

**Response Example**:
```json
{
  "data": [
    {
      "id": 1,
      "nama": "MI Al-Hikmah",
      "slug": "mi-al-hikmah",
      "profilMd": "### Profil Madrasah...",
      "frontImages": [...],
      "santris": {
        "count": 150
      },
      "staffs": {
        "count": 25
      },
      "kelas": {
        "count": 6
      }
    }
  ]
}
```

---

### Get Lembaga by Slug

```javascript
// Get single lembaga
GET /api/lembagas?filters[slug][$eq]=mi-al-hikmah&populate=*
```

---

## 🎯 Advanced Query Patterns

### OR Conditions

```javascript
// Santri laki-laki ATAU di Kelas 1
GET /api/santris?filters[$or][0][gender][$eq]=L&filters[$or][1][kelasAktif][$eq]=Kelas 1
```

---

### AND + OR Combined

```javascript
// Santri laki-laki DAN (di Kelas 1 ATAU Kelas 2)
GET /api/santris?
  filters[gender][$eq]=L&
  filters[$or][0][kelasAktif][$eq]=Kelas 1&
  filters[$or][1][kelasAktif][$eq]=Kelas 2
```

---

### Nested Relations

```javascript
// Prestasi santri laki-laki di lembaga X
GET /api/prestasis?
  filters[santri][gender][$eq]=L&
  filters[santri][lembaga][id][$eq]=1&
  populate[santri][populate][lembaga]=*
```

---

### Count Only

```javascript
// Count santri aktif
GET /api/santris?filters[isAlumni][$eq]=false&pagination[pageSize]=1

// Check response meta.pagination.total
```

---

### Select Fields (Reduce Response Size)

```javascript
// Only get specific fields
GET /api/santris?fields[0]=nama&fields[1]=nisn&fields[2]=kelasAktif
```

---

## 📊 Aggregation Queries

### Count Santri per Kelas

```javascript
// Via frontend: fetch all and group by kelasAktif
const santris = await fetch('/api/santris?filters[lembaga][id][$eq]=1&fields[0]=kelasAktif');
const grouped = santris.data.reduce((acc, s) => {
  acc[s.kelasAktif] = (acc[s.kelasAktif] || 0) + 1;
  return acc;
}, {});
```

---

### Total Poin Pelanggaran Santri

```javascript
// Fetch all pelanggaran of a santri
const pelanggaran = await fetch('/api/pelanggarans?filters[santri][id][$eq]=1');
const totalPoin = pelanggaran.data.reduce((sum, p) => sum + p.poin, 0);
```

---

## 🚀 Performance Tips

1. **Use selective populate** instead of `populate=*`
2. **Limit fields** with `fields` parameter
3. **Pagination** for large datasets
4. **Cache** lembaga, kelas, tahunAjaran (rarely change)
5. **Index** frequently filtered fields (nisn, nama, etc.)

---

## 🛡️ Error Handling

```javascript
try {
  const response = await fetch('/api/santris?filters[lembaga][id][$eq]=1');
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  const json = await response.json();
  
  if (json.error) {
    console.error('Strapi Error:', json.error);
    return;
  }
  
  const santris = json.data;
  // Process data...
  
} catch (error) {
  console.error('Network Error:', error);
}
```

---

## 📝 Summary

- Use `filters` for WHERE conditions
- Use `populate` to include relations
- Use `sort` for ordering
- Use `pagination` for paging
- Use `fields` to select specific fields
- Chain conditions with `&`
- Use nested filters for related data

**Happy querying! 🚀**
