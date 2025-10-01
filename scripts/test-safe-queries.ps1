# Test Safe Alternative Query untuk Flutter
# Query ini menggantikan populate=all dengan selective populate

Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Testing Safe Alternative Queries" -ForegroundColor Cyan
Write-Host "Replacing populate=all" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:1337/api"
$slug = "madrasah-aliyah-putra"
$token = "6fafa1627053beaabaf383b1324290901ea7a75115fa355089229ad6dadc1b17a4583ae779c0eee91c928493a743d68230c4069f8bce62ab1ff79104166324361f681dc419ef0b50e6b6bcd4579d4cad6a37510b9d3e5301d5180b527efe3df68806570059b54ac8d21ca584aa0e1dbb2695cecb79ffb7300478bc7c0a60b2ce"
$headers = @{
    "Authorization" = "Bearer $token"
}

# Test 1: Query dengan selective populate (Level 1)
Write-Host "Test 1: Lembaga dengan Selective Populate (Basic)" -ForegroundColor Yellow
$url1 = "$baseUrl/lembagas?filters[slug][`$eq]=$slug&populate[frontImages]=true&populate[videoLinks]=true&populate[kontak]=true"
Write-Host "URL: $url1" -ForegroundColor Gray
Write-Host ""
try {
    $startTime = Get-Date
    $result1 = Invoke-RestMethod -Uri $url1 -Method Get -Headers $headers -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "⏱️  Response Time: $([math]::Round($duration, 2)) ms" -ForegroundColor Cyan
    Write-Host "Data Count: $($result1.data.Count)" -ForegroundColor Green
    if ($result1.data.Count -gt 0) {
        $lembaga = $result1.data[0]
        Write-Host "Lembaga: $($lembaga.nama)" -ForegroundColor Green
        Write-Host "ProfilMd Length: $($lembaga.profilMd.Length) chars" -ForegroundColor Green
        Write-Host "ProgramKerjaMd Length: $($lembaga.programKerjaMd.Length) chars" -ForegroundColor Green
        
        # Check frontImages
        if ($lembaga.frontImages) {
            Write-Host "FrontImages: $($lembaga.frontImages.Count) images" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result1 | ConvertTo-Json -Depth 5
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""
Write-Host "========================================" -ForegroundColor Gray
Write-Host ""

# Test 2: Query dengan field selection (Optimal)
Write-Host "Test 2: Lembaga dengan Field Selection (Recommended)" -ForegroundColor Yellow
$url2 = "$baseUrl/lembagas?filters[slug][`$eq]=$slug&fields[0]=nama&fields[1]=slug&fields[2]=profilMd&fields[3]=programKerjaMd&fields[4]=createdAt&fields[5]=updatedAt&populate[frontImages][fields][0]=url&populate[frontImages][fields][1]=name&populate[frontImages][fields][2]=alternativeText&populate[frontImages][fields][3]=width&populate[frontImages][fields][4]=height&populate[videoLinks][fields][0]=url&populate[videoLinks][fields][1]=judul&populate[kontak][fields][0]=alamat&populate[kontak][fields][1]=telepon&populate[kontak][fields][2]=email&populate[kontak][fields][3]=website"
Write-Host "URL: $url2" -ForegroundColor Gray
Write-Host ""
try {
    $startTime = Get-Date
    $result2 = Invoke-RestMethod -Uri $url2 -Method Get -Headers $headers -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    
    Write-Host "✓ Success!" -ForegroundColor Green
    Write-Host "⏱️  Response Time: $([math]::Round($duration, 2)) ms" -ForegroundColor Cyan
    Write-Host "Data Count: $($result2.data.Count)" -ForegroundColor Green
    if ($result2.data.Count -gt 0) {
        $lembaga = $result2.data[0]
        Write-Host "Lembaga: $($lembaga.nama)" -ForegroundColor Green
        Write-Host "ProfilMd: $($lembaga.profilMd -ne $null)" -ForegroundColor Green
        Write-Host "ProgramKerjaMd: $($lembaga.programKerjaMd -ne $null)" -ForegroundColor Green
        
        if ($lembaga.frontImages) {
            Write-Host "FrontImages: $($lembaga.frontImages.Count) images" -ForegroundColor Green
            foreach ($img in $lembaga.frontImages) {
                Write-Host "  - $($img.name): $($img.url)" -ForegroundColor Gray
            }
        }
        
        if ($lembaga.videoLinks) {
            Write-Host "VideoLinks: $($lembaga.videoLinks.Count) videos" -ForegroundColor Green
        }
        
        Write-Host ""
        Write-Host "JSON Response:" -ForegroundColor Cyan
        $result2 | ConvertTo-Json -Depth 5
    }
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""
Write-Host "========================================" -ForegroundColor Gray
Write-Host ""

# Test 3: Separate Requests (Bertahap - Most Stable)
Write-Host "Test 3: Separate Requests (Production-Ready Pattern)" -ForegroundColor Yellow
Write-Host ""

# 3a: Basic Lembaga Info
Write-Host "  3a: Basic Lembaga Info" -ForegroundColor Cyan
$url3a = "$baseUrl/lembagas?filters[slug][`$eq]=$slug&fields[0]=nama&fields[1]=slug&fields[2]=profilMd&fields[3]=programKerjaMd"
try {
    $startTime = Get-Date
    $lembagaBasic = Invoke-RestMethod -Uri $url3a -Method Get -Headers $headers -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    
    Write-Host "  ✓ Lembaga Info: $([math]::Round($duration, 2)) ms" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3b: FrontImages
Write-Host "  3b: Front Images" -ForegroundColor Cyan
$url3b = "$baseUrl/lembagas?filters[slug][`$eq]=$slug&fields[0]=nama&populate[frontImages][fields][0]=url&populate[frontImages][fields][1]=name&populate[frontImages][fields][2]=width&populate[frontImages][fields][3]=height"
try {
    $startTime = Get-Date
    $images = Invoke-RestMethod -Uri $url3b -Method Get -Headers $headers -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    
    if ($images.data.Count -gt 0 -and $images.data[0].frontImages) {
        Write-Host "  ✓ Images: $($images.data[0].frontImages.Count) images | $([math]::Round($duration, 2)) ms" -ForegroundColor Green
    } else {
        Write-Host "  ✓ No images | $([math]::Round($duration, 2)) ms" -ForegroundColor Green
    }
} catch {
    Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3c: Statistics (Count only)
Write-Host "  3c: Statistics" -ForegroundColor Cyan

# Santri count
$url3c1 = "$baseUrl/santris?filters[lembaga][slug][`$eq]=$slug&pagination[pageSize]=1"
try {
    $startTime = Get-Date
    $santriCount = Invoke-RestMethod -Uri $url3c1 -Method Get -Headers $headers -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    
    $total = $santriCount.meta.pagination.total
    Write-Host "  ✓ Santri Count: $total | $([math]::Round($duration, 2)) ms" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Staff count
$url3c2 = "$baseUrl/staffs?filters[lembaga][slug][`$eq]=$slug&filters[aktif][`$eq]=true&pagination[pageSize]=1"
try {
    $startTime = Get-Date
    $staffCount = Invoke-RestMethod -Uri $url3c2 -Method Get -Headers $headers -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    
    $total = $staffCount.meta.pagination.total
    Write-Host "  ✓ Staff Count: $total | $([math]::Round($duration, 2)) ms" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Prestasi count
$url3c3 = "$baseUrl/prestasis?filters[santri][lembaga][slug][`$eq]=$slug&pagination[pageSize]=1"
try {
    $startTime = Get-Date
    $prestasiCount = Invoke-RestMethod -Uri $url3c3 -Method Get -Headers $headers -ErrorAction Stop
    $endTime = Get-Date
    $duration = ($endTime - $startTime).TotalMilliseconds
    
    $total = $prestasiCount.meta.pagination.total
    Write-Host "  ✓ Prestasi Count: $total | $([math]::Round($duration, 2)) ms" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Gray
Write-Host ""

# Summary
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "SUMMARY & RECOMMENDATIONS" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Test 1: Basic Selective Populate" -ForegroundColor Green
Write-Host "   Use Case: Quick detail page load" -ForegroundColor Gray
Write-Host "   Pros: Simple query, fast response" -ForegroundColor Gray
Write-Host "   Cons: Returns all relation data (bisa besar)" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Test 2: Field Selection (RECOMMENDED)" -ForegroundColor Green
Write-Host "   Use Case: Detail page dengan kontrol payload" -ForegroundColor Gray
Write-Host "   Pros: Kontrol exact fields, optimal payload" -ForegroundColor Gray
Write-Host "   Cons: Query string panjang" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Test 3: Separate Requests (PRODUCTION)" -ForegroundColor Green
Write-Host "   Use Case: Large data, progressive loading" -ForegroundColor Gray
Write-Host "   Pros: Most stable, cacheable, parallel loading" -ForegroundColor Gray
Write-Host "   Cons: Multiple HTTP requests" -ForegroundColor Gray
Write-Host ""
Write-Host "❌ populate=all: NEVER USE!" -ForegroundColor Red
Write-Host "   Result: Server stuck, memory crash" -ForegroundColor Red
Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan
