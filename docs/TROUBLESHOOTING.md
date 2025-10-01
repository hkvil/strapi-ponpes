# 🔧 Troubleshooting Guide

Panduan mengatasi masalah umum pada Strapi Ponpes Management System.

---

## 📋 Daftar Isi

1. [Memory Issues](#memory-issues)
2. [Database Issues](#database-issues)
3. [API Issues](#api-issues)
4. [Build Issues](#build-issues)

---

## 🧠 Memory Issues

### Problem: JavaScript Heap Out of Memory

**Error Message:**
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

**Penyebab:**
- Node.js kehabisan memory (default limit ~2GB)
- Terjadi saat development server berjalan lama
- Banyak data seeder (~8,200 records)
- File watching yang intensif

**Solusi:**

✅ **Sudah diterapkan di `package.json`:**

```json
{
  "scripts": {
    "develop": "node --max-old-space-size=4096 node_modules/@strapi/strapi/bin/strapi.js develop"
  }
}
```

**Opsi Memory Limit:**
- `2048` = 2GB (minimum untuk Strapi dengan banyak data)
- `4096` = 4GB (recommended untuk development) ✅
- `8192` = 8GB (untuk production atau data sangat besar)

**Cara Menggunakan:**
```bash
# Restart development server
npm run develop
```

**Alternatif Manual:**
```bash
# Jika ingin mengatur manual
node --max-old-space-size=4096 node_modules/@strapi/strapi/bin/strapi.js develop
```

**Tips Mencegah:**
1. Restart server secara berkala (setiap 2-3 jam development)
2. Tutup terminal yang tidak digunakan
3. Kurangi jumlah file watcher jika memungkinkan
4. Gunakan `npm run start` (production mode) jika tidak perlu auto-reload

---

## 🗄️ Database Issues

### Problem: SQLite Database Locked

**Error Message:**
```
SQLITE_BUSY: database is locked
```

**Solusi:**
1. Tutup semua koneksi ke database
2. Restart Strapi server
3. Jika masih terjadi, hapus file `.tmp` di folder database

```bash
# PowerShell
Remove-Item -Recurse -Force .tmp -ErrorAction SilentlyContinue
```

### Problem: Data Tidak Muncul Setelah Seeder

**Checklist:**
- [ ] Pastikan seeder berhasil dijalankan
- [ ] Check `publishedAt` field (harus tidak null)
- [ ] Pastikan relasi terisi dengan benar
- [ ] Restart Strapi server

**Cara Check:**
```bash
# Jalankan seeder
npm run seed:example

# Check log untuk error
# Look for "✓ Successfully created X records"
```

---

## 🔌 API Issues

### Problem: 400 Bad Request pada Filter

**Penyebab:**
- Filter syntax salah
- Collection name salah (plural vs singular)
- Relasi tidak ada di schema

**Solusi:**

✅ **Collection Naming:**
- Lembaga → `/api/lembagas`
- Santri → `/api/santris`
- Staff → `/api/staffs`
- Kelas → `/api/kelass` (double s!)
- Prestasi → `/api/prestasis`
- Pelanggaran → `/api/pelanggarans`

✅ **Filter Syntax:**

**Direct field:**
```
filters[aktif][$eq]=true
```

**Nested relation:**
```
filters[lembaga][slug][$eq]=madrasah-aliyah-putri
```

**Deep relation (3 levels):**
```
filters[santri][riwayatKelas][tahunAjaran][aktif][$eq]=true
```

**Contoh URL Lengkap:**
```
http://localhost:1337/api/santris?filters[lembaga][slug][$eq]=madrasah-aliyah-putri&filters[riwayatKelas][tahunAjaran][aktif][$eq]=true
```

### Problem: 401 Unauthorized

**Solusi:**
1. Pastikan Bearer token valid
2. Check token tidak expired
3. Pastikan header format benar:

```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}
```

### Problem: Empty Data Response

**Checklist:**
- [ ] Check filter values benar (case-sensitive untuk slug)
- [ ] Pastikan data sudah di-publish (`publishedAt` tidak null)
- [ ] Check relasi terisi dengan benar
- [ ] Gunakan `populate` jika butuh relasi data:

```
?populate=*  # Populate all relations (level 1)
?populate[lembaga]=true  # Populate specific relation
```

---

## 🏗️ Build Issues

### Problem: TypeScript Compilation Error

**Error Message:**
```
Type 'string' is not assignable to type 'enum_value'
```

**Solusi:**
1. Pastikan enum values sesuai dengan schema
2. Gunakan type assertion jika perlu:

```typescript
const data = {
  tingkat: "Internasional" as "Internasional",
  // atau
  tingkat: "Internasional" as any
}
```

### Problem: Module Not Found

**Solusi:**
```bash
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 🚀 Performance Optimization

### Tips untuk Development Server

1. **Memory Management:**
   - Restart server setiap 2-3 jam
   - Close unused terminals
   - Monitor memory usage di Task Manager

2. **Database Optimization:**
   - Index fields yang sering di-filter
   - Gunakan pagination untuk query besar
   - Limit jumlah populate

3. **API Performance:**
   - Gunakan `pageSize` untuk limit results
   - Filter di backend, bukan di frontend
   - Cache API responses jika memungkinkan

### Recommended Settings untuk Production

```json
// package.json
{
  "scripts": {
    "start": "NODE_ENV=production node --max-old-space-size=4096 node_modules/@strapi/strapi/bin/strapi.js start"
  }
}
```

**Environment Variables:**
```env
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=4096
DATABASE_CLIENT=better-sqlite3
DATABASE_FILENAME=.tmp/data.db
```

---

## 📞 Getting Help

Jika masalah masih terjadi setelah mengikuti panduan ini:

1. **Check Strapi Documentation:**
   - https://docs.strapi.io/

2. **Check GitHub Issues:**
   - Strapi: https://github.com/strapi/strapi/issues
   - This Project: https://github.com/hkvil/strapi-ponpes/issues

3. **Check System Requirements:**
   - Node.js >= 18.x
   - NPM >= 6.x
   - RAM >= 4GB (recommended 8GB)
   - Disk Space >= 1GB

4. **Debug Commands:**

```bash
# Check Node version
node --version

# Check NPM version
npm --version

# Check Strapi version
npm list @strapi/strapi

# Check memory usage
node --v8-options | findstr /C:"max-old-space-size"
```

---

## 📝 Common Commands

```bash
# Development
npm run develop              # Start dev server (dengan memory fix)
npm run seed:example         # Run seeder

# Testing
.\scripts\test-api.ps1       # Test semua API endpoints

# Production
npm run build                # Build for production
npm run start                # Start production server

# Maintenance
npm run strapi               # Strapi CLI
npm run console              # Strapi console
```

---

**Last Updated:** October 1, 2025  
**Version:** 1.0.0
