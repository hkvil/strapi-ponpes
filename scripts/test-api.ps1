# Test API Endpoints for Ponpes Management System
# Slug: madrasah-aliyah-putri

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Testing Ponpes API Endpoints" -ForegroundColor Cyan
Write-Host "Slug: madrasah-aliyah-putri" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:1337/api"
$slug = "madrasah-aliyah-putri"
$token = "6fafa1627053beaabaf383b1324290901ea7a75115fa355089229ad6dadc1b17a4583ae779c0eee91c928493a743d68230c4069f8bce62ab1ff79104166324361f681dc419ef0b50e6b6bcd4579d4cad6a37510b9d3e5301d5180b527efe3df68806570059b54ac8d21ca584aa0e1dbb2695cecb79ffb7300478bc7c0a60b2ce"
$headers = @{
    "Authorization" = "Bearer $token"
}

# Test 1: Lembaga
Write-Host "Test 1: Get Lembaga by Slug" -ForegroundColor Yellow
$url1 = "$baseUrl/lembagas?filters[slug][`$eq]=$slug"
Write-Host "URL: $url1" -ForegroundColor Gray
try {
    $result1 = Invoke-RestMethod -Uri $url1 -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result1.data.Count)" -ForegroundColor Green
    if ($result1.data.Count -gt 0) {
        Write-Host "Lembaga: $($result1.data[0].attributes.nama)" -ForegroundColor Green
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result1 | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Santri
Write-Host "Test 2: Get Santri by Lembaga (Active Tahun Ajaran via Riwayat Kelas)" -ForegroundColor Yellow
$url2 = "$baseUrl/santris?filters[lembaga][slug][`$eq]=$slug&filters[riwayatKelas][tahunAjaran][aktif][`$eq]=true&pagination[pageSize]=5"
Write-Host "URL: $url2" -ForegroundColor Gray
try {
    $result2 = Invoke-RestMethod -Uri $url2 -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result2.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result2.meta.pagination.total)" -ForegroundColor Green
    if ($result2.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result2 | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Staff
Write-Host "Test 3: Get Staff by Lembaga (Active Only)" -ForegroundColor Yellow
$url3 = "$baseUrl/staffs?filters[lembaga][slug][`$eq]=$slug&filters[aktif][`$eq]=true&pagination[pageSize]=5"
Write-Host "URL: $url3" -ForegroundColor Gray
try {
    $result3 = Invoke-RestMethod -Uri $url3 -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result3.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result3.meta.pagination.total)" -ForegroundColor Green
    if ($result3.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result3 | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Kelas
Write-Host "Test 4: Get Kelas by Lembaga" -ForegroundColor Yellow
$url4 = "$baseUrl/kelass?filters[lembaga][slug][`$eq]=$slug"
Write-Host "URL: $url4" -ForegroundColor Gray
try {
    $result4 = Invoke-RestMethod -Uri $url4 -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result4.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result4.meta.pagination.total)" -ForegroundColor Green
    if ($result4.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result4 | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Alumni
Write-Host "Test 5: Get Alumni by Lembaga" -ForegroundColor Yellow
$url5 = "$baseUrl/santris?filters[isAlumni][`$eq]=true&filters[lembaga][slug][`$eq]=$slug&pagination[pageSize]=5"
Write-Host "URL: $url5" -ForegroundColor Gray
try {
    $result5 = Invoke-RestMethod -Uri $url5 -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result5.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result5.meta.pagination.total)" -ForegroundColor Green
    if ($result5.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result5 | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6a: Prestasi (All History)
Write-Host "Test 6a: Get Prestasi by Lembaga (All History)" -ForegroundColor Yellow
$url6a = "$baseUrl/prestasis?filters[santri][lembaga][slug][`$eq]=$slug&pagination[pageSize]=5"
Write-Host "URL: $url6a" -ForegroundColor Gray
try {
    $result6a = Invoke-RestMethod -Uri $url6a -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result6a.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result6a.meta.pagination.total)" -ForegroundColor Green
    if ($result6a.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result6a | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6b: Prestasi (Active Tahun Ajaran Only)
Write-Host "Test 6b: Get Prestasi by Lembaga (Active Tahun Ajaran Only)" -ForegroundColor Yellow
$url6b = "$baseUrl/prestasis?filters[santri][lembaga][slug][`$eq]=$slug&filters[santri][riwayatKelas][tahunAjaran][aktif][`$eq]=true&pagination[pageSize]=5"
Write-Host "URL: $url6b" -ForegroundColor Gray
try {
    $result6b = Invoke-RestMethod -Uri $url6b -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result6b.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result6b.meta.pagination.total)" -ForegroundColor Green
    if ($result6b.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result6b | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7a: Pelanggaran (All History)
Write-Host "Test 7a: Get Pelanggaran by Lembaga (All History)" -ForegroundColor Yellow
$url7a = "$baseUrl/pelanggarans?filters[santri][lembaga][slug][`$eq]=$slug&pagination[pageSize]=5"
Write-Host "URL: $url7a" -ForegroundColor Gray
try {
    $result7a = Invoke-RestMethod -Uri $url7a -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result7a.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result7a.meta.pagination.total)" -ForegroundColor Green
    if ($result7a.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result7a | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 7b: Pelanggaran (Active Tahun Ajaran Only)
Write-Host "Test 7b: Get Pelanggaran by Lembaga (Active Tahun Ajaran Only)" -ForegroundColor Yellow
$url7b = "$baseUrl/pelanggarans?filters[santri][lembaga][slug][`$eq]=$slug&filters[santri][riwayatKelas][tahunAjaran][aktif][`$eq]=true&pagination[pageSize]=5"
Write-Host "URL: $url7b" -ForegroundColor Gray
try {
    $result7b = Invoke-RestMethod -Uri $url7b -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result7b.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result7b.meta.pagination.total)" -ForegroundColor Green
    if ($result7b.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result7b | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 8: Kehadiran Santri
Write-Host "Test 8: Get Kehadiran Santri by Lembaga (Active Tahun Ajaran via Riwayat Kelas)" -ForegroundColor Yellow
$url8 = "$baseUrl/kehadiran-santris?filters[santri][lembaga][slug][`$eq]=$slug&filters[riwayatKelas][tahunAjaran][aktif][`$eq]=true&pagination[pageSize]=5"
Write-Host "URL: $url8" -ForegroundColor Gray
try {
    $result8 = Invoke-RestMethod -Uri $url8 -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result8.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result8.meta.pagination.total)" -ForegroundColor Green
    if ($result8.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result8 | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 9: Kehadiran Guru
Write-Host "Test 9: Get Kehadiran Guru by Lembaga (Active Tahun Ajaran)" -ForegroundColor Yellow
$url9 = "$baseUrl/kehadiran-gurus?filters[staff][lembaga][slug][`$eq]=$slug&filters[tahunAjaran][aktif][`$eq]=true&pagination[pageSize]=5"
Write-Host "URL: $url9" -ForegroundColor Gray
try {
    $result9 = Invoke-RestMethod -Uri $url9 -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result9.data.Count)" -ForegroundColor Green
    Write-Host "Total: $($result9.meta.pagination.total)" -ForegroundColor Green
    if ($result9.data.Count -gt 0) {
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result9 | ConvertTo-Json -Depth 4
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 10: Tahun Ajaran Aktif
Write-Host "Test 10: Get Active Tahun Ajaran" -ForegroundColor Yellow
$url10 = "$baseUrl/tahun-ajarans?filters[aktif][`$eq]=true"
Write-Host "URL: $url10" -ForegroundColor Gray
try {
    $result10 = Invoke-RestMethod -Uri $url10 -Method Get -Headers $headers -ErrorAction Stop
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "Data Count: $($result10.data.Count)" -ForegroundColor Green
    if ($result10.data.Count -gt 0) {
        Write-Host "Active Year: $($result10.data[0].attributes.tahun)" -ForegroundColor Green
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result10 | ConvertTo-Json -Depth 3
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
