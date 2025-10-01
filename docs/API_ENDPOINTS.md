# 🔗 API Endpoints - Ponpes Management System

## Base URL
```
http://localhost:1337/api
```

## ⚠️ Important Notes

1. **Authentication Required**: Most endpoints require JWT token authentication
2. **Permissions**: Make sure to enable public or authenticated access in Strapi Admin → Settings → Users & Permissions
3. **Deep Populate**: Use `populate=*` for simple cases or `populate[relation][populate]=*` for nested relations
4. **Filters**: Strapi v5 uses `filters[field][$operator]=value` syntax

---

## 📋 Available Endpoints

### 1. **Santri (Students) - GET All**

**Endpoint:**
```
GET /api/santris
```

**With Filters:**
```
GET /api/santris?filters[lembaga][slug][$eq]=ma
```

**With Populate (Basic):**
```
GET /api/santris?populate=*
```

**With Deep Populate (Lembaga + Kehadiran):**
```
GET /api/santris?populate[lembaga]=*&populate[kehadiran_santri][populate][riwayatKelas][populate][tahunAjaran]=*
```

**Filter by Active Tahun Ajaran:**
```
GET /api/santris?filters[lembaga][slug][$eq]=ma&populate[kehadiran_santri][populate][riwayatKelas][filters][tahunAjaran][aktif][$eq]=true
```

---

### 2. **Staff (Teachers) - GET All**

**Endpoint:**
```
GET /api/staffs
```

**With Filters by Lembaga:**
```
GET /api/staffs?filters[lembaga][slug][$eq]=ma
```

**With Kehadiran Guru:**
```
GET /api/staffs?populate[kehadiran][populate][tahunAjaran]=*&filters[lembaga][slug][$eq]=ma
```

**Filter by Active Tahun Ajaran:**
```
GET /api/staffs?filters[lembaga][slug][$eq]=ma&populate[kehadiran][filters][tahunAjaran][aktif][$eq]=true
```

---

### 3. **Alumni - GET All**

**Endpoint:**
```
GET /api/santris?filters[isAlumni][$eq]=true
```

**Filter by Lembaga:**
```
GET /api/santris?filters[isAlumni][$eq]=true&filters[lembaga][slug][$eq]=ma
```

**With Details:**
```
GET /api/santris?filters[isAlumni][$eq]=true&filters[lembaga][slug][$eq]=ma&populate[lembaga]=*&populate[kelasAktif]=*
```

---

### 4. **Prestasi (Achievements) - GET All**

**Endpoint:**
```
GET /api/prestasis
```

**Filter by Lembaga:**
```
GET /api/prestasis?filters[santri][lembaga][slug][$eq]=ma
```

**With Santri & Active Tahun Ajaran:**
```
GET /api/prestasis?filters[santri][lembaga][slug][$eq]=ma&populate[santri][populate][lembaga]=*&populate[tahunAjaran][filters][aktif][$eq]=true
```

---

### 5. **Pelanggaran (Violations) - GET All**

**Endpoint:**
```
GET /api/pelanggarans
```

**Filter by Lembaga:**
```
GET /api/pelanggarans?filters[santri][lembaga][slug][$eq]=ma
```

**With Santri & Active Tahun Ajaran:**
```
GET /api/pelanggarans?filters[santri][lembaga][slug][$eq]=ma&populate[santri][populate][lembaga]=*&populate[tahunAjaran][filters][aktif][$eq]=true
```

---

### 6. **Kehadiran Santri - GET All**

**Endpoint:**
```
GET /api/kehadiran-santris
```

**Filter by Santri + Lembaga:**
```
GET /api/kehadiran-santris?filters[santri][lembaga][slug][$eq]=ma&populate[santri][populate][lembaga]=*
```

**With Active Tahun Ajaran via Riwayat Kelas:**
```
GET /api/kehadiran-santris?filters[riwayatKelas][tahunAjaran][aktif][$eq]=true&filters[santri][lembaga][slug][$eq]=ma&populate[santri]=*&populate[riwayatKelas][populate][tahunAjaran]=*
```

---

### 7. **Kehadiran Guru - GET All**

**Endpoint:**
```
GET /api/kehadiran-gurus
```

**Filter by Staff + Lembaga:**
```
GET /api/kehadiran-gurus?filters[staff][lembaga][slug][$eq]=ma&populate[staff][populate][lembaga]=*
```

**With Active Tahun Ajaran:**
```
GET /api/kehadiran-gurus?filters[tahunAjaran][aktif][$eq]=true&filters[staff][lembaga][slug][$eq]=ma&populate[staff]=*&populate[tahunAjaran]=*
```

---

### 8. **Tahun Ajaran (Academic Years) - GET Active**

**Get Active Tahun Ajaran:**
```
GET /api/tahun-ajarans?filters[aktif][$eq]=true
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 15,
      "documentId": "f6k28wo50potq9x3lgldw4d3",
      "tahunAjaran": "2024/2025",
      "semester": "GANJIL",
      "aktif": true,
      "label": "2024/2025 - GANJIL",
      "createdAt": "2025-10-01T08:16:58.026Z",
      "updatedAt": "2025-10-01T08:16:58.026Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

**With All Relations:**
```
GET /api/tahun-ajarans?filters[aktif][$eq]=true&populate=*
```

---

### 9. **Lembaga (Institutions) - GET All**

**Endpoint:**
```
GET /api/lembagas
```

**Get by Slug:**
```
GET /api/lembagas?filters[slug][$eq]=ma
```

**With Santri Count:**
```
GET /api/lembagas?filters[slug][$eq]=ma&populate[santris]=*
```

---

### 10. **Kelas (Classes) - GET All**

**Endpoint:**
```
GET /api/kelass
```

**Filter by Lembaga:**
```
GET /api/kelass?filters[lembaga][slug][$eq]=taman-kanak-kanak
```

**Example Response:**
```json
{
  "data": [
    {
      "id": 16,
      "documentId": "zdso2d2o7am35x1mt36qu78x",
      "kelas": "BANANA",
      "createdAt": "2025-10-01T07:08:49.835Z",
      "updatedAt": "2025-10-01T07:08:49.835Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

---

### 11. **Riwayat Kelas - GET All**

**Endpoint:**
```
GET /api/riwayat-kelas
```

**Filter by Active Tahun Ajaran + Lembaga:**
```
GET /api/riwayat-kelas?filters[tahunAjaran][aktif][$eq]=true&filters[santri][lembaga][slug][$eq]=ma&populate[santri]=*&populate[kelas]=*&populate[tahunAjaran]=*
```

---

## 🔧 Common Query Parameters

### Pagination
```
?pagination[page]=1&pagination[pageSize]=25
```

### Sorting
```
?sort[0]=nama:asc
?sort[0]=createdAt:desc
```

### Search (if search plugin enabled)
```
?filters[$or][0][nama][$containsi]=ahmad&filters[$or][1][nisn][$containsi]=ahmad
```

### Limit Results
```
?pagination[pageSize]=10&pagination[withCount]=true
```

---

## 📊 Response Structure

All endpoints return data in this format:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "nama": "Ahmad Hidayat",
        "nisn": "1234567890",
        "createdAt": "2025-10-01T10:00:00.000Z",
        "updatedAt": "2025-10-01T10:00:00.000Z",
        "lembaga": {
          "data": {
            "id": 1,
            "attributes": {
              "nama": "Madrasah Aliyah",
              "slug": "ma"
            }
          }
        }
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 50
    }
  }
}
```

---

## 🔐 Authentication

### Get JWT Token
```
POST /api/auth/local
Content-Type: application/json

{
  "identifier": "admin@example.com",
  "password": "yourpassword"
}
```

### Use Token in Requests
```
GET /api/santris
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 💡 PowerShell Examples

### Basic Request
```powershell
$response = Invoke-RestMethod -Uri "http://localhost:1337/api/santris" -Method Get
$response.data
```

### With Token
```powershell
$headers = @{
    "Authorization" = "Bearer YOUR_JWT_TOKEN"
}
$response = Invoke-RestMethod -Uri "http://localhost:1337/api/santris" -Headers $headers -Method Get
```

### With Filters
```powershell
$uri = "http://localhost:1337/api/santris?filters[lembaga][slug][$eq]=ma&populate=*"
$response = Invoke-RestMethod -Uri $uri -Method Get
$response.data
```

---

## ⚙️ Enable Public Access

To test these endpoints without authentication:

1. Go to Strapi Admin: `http://localhost:1337/admin`
2. Navigate to: **Settings → Users & Permissions → Roles → Public**
3. Enable permissions for the content types you want to access:
   - ✅ `find` (GET collection)
   - ✅ `findOne` (GET single item)
4. Save and test your endpoints

---

## 🚨 Common Issues

### Issue: "Forbidden" Error
**Solution**: Enable public access or use authenticated requests with JWT token

### Issue: Empty Relations
**Solution**: Use proper `populate` parameter:
- Simple: `populate=*`
- Deep: `populate[relation][populate]=*`

### Issue: Too Much Data
**Solution**: Use pagination and select specific fields:
```
?pagination[pageSize]=10&fields[0]=nama&fields[1]=nisn
```

### Issue: Slow Queries
**Solution**: 
- Limit populate depth
- Add database indexes
- Use pagination
- Filter early in the query chain

---

## 📝 Notes

1. **Collection Names**: Strapi pluralizes collection names automatically:
   - `santri` → `/api/santris`
   - `staff` → `/api/staffs`
   - `kelas` → `/api/kelass` ⚠️ (double 's')
   - `kehadiran-santri` → `/api/kehadiran-santris`
   - `prestasi` → `/api/prestasis`
   - `pelanggaran` → `/api/pelanggarans`

2. **Relation Filtering**: You can filter by nested relations:
   ```
   filters[santri][lembaga][slug][$eq]=ma
   ```

3. **Date Filters**: Use date operators for date fields:
   ```
   filters[tanggal][$gte]=2025-01-01&filters[tanggal][$lte]=2025-12-31
   ```

4. **Enum Filters**: Use exact enum values:
   ```
   filters[jenis][$eq]=HADIR
   filters[statusSantri][$eq]=AKTIF
   ```

---

## 🔗 Related Documentation

- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [Filters & Populate](https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication)
- [Schema Relationships](./SCHEMA_RELATIONSHIPS.md)
