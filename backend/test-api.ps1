# Test Backend API Scripts

# Replace YOUR_BACKEND_URL with your actual backend URL
$BACKEND_URL = "http://localhost:4000"  # Local
# $BACKEND_URL = "https://your-backend.onrender.com"  # Production

Write-Host "🧪 Testing Backend API..." -ForegroundColor Cyan
Write-Host "Backend URL: $BACKEND_URL" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Health Check" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/health" -Method Get
    Write-Host "✅ PASSED" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: API Root
Write-Host "Test 2: API Root" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/" -Method Get
    Write-Host "✅ PASSED" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Register User
Write-Host "Test 3: Register User" -ForegroundColor Green
$registerData = @{
    email = "test@example.com"
    password = "Test123!"
    name = "Test User"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/auth/register" -Method Post -Body $registerData -ContentType "application/json"
    Write-Host "✅ PASSED" -ForegroundColor Green
    $response | ConvertTo-Json
    $global:userId = $response.user._id
} catch {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "⚠️ User already exists (this is okay)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 4: Login User
Write-Host "Test 4: Login User" -ForegroundColor Green
$loginData = @{
    email = "test@example.com"
    password = "Test123!"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/auth/login" -Method Post -Body $loginData -ContentType "application/json"
    Write-Host "✅ PASSED" -ForegroundColor Green
    $global:accessToken = $response.accessToken
    Write-Host "Access Token: $global:accessToken" -ForegroundColor Cyan
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get Profile (Authenticated)
Write-Host "Test 5: Get Profile (Authenticated)" -ForegroundColor Green
try {
    $headers = @{
        "Authorization" = "Bearer $global:accessToken"
    }
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/users/profile" -Method Get -Headers $headers
    Write-Host "✅ PASSED" -ForegroundColor Green
    $response | ConvertTo-Json
} catch {
    Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 6: 404 Test
Write-Host "Test 6: 404 Not Found" -ForegroundColor Green
try {
    $response = Invoke-RestMethod -Uri "$BACKEND_URL/notfound" -Method Get
    Write-Host "❌ FAILED: Should return 404" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ PASSED: 404 handler working" -ForegroundColor Green
    } else {
        Write-Host "❌ FAILED: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "🎉 All tests completed!" -ForegroundColor Cyan
