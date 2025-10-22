# Script để push backend lên GitHub
# Chạy: powershell -ExecutionPolicy Bypass -File push-to-github.ps1

Write-Host "🚀 PUSH BACKEND TO GITHUB" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Kiểm tra thư mục hiện tại
$currentDir = Get-Location
if ($currentDir -notlike "*backend*") {
    Write-Host "⚠️  Đang ở thư mục: $currentDir" -ForegroundColor Yellow
    Write-Host "📁 Di chuyển vào thư mục backend..." -ForegroundColor Yellow
    Set-Location -Path "d:\code\PhatTrienPMMNM\ThucHanh\group12-project\backend"
}

Write-Host "📍 Current directory: $(Get-Location)" -ForegroundColor Green
Write-Host ""

# Bước 1: Git Status
Write-Host "📊 Step 1: Checking git status..." -ForegroundColor Cyan
git status
Write-Host ""

# Xác nhận
Write-Host "⚠️  QUAN TRỌNG: Kiểm tra danh sách files trên!" -ForegroundColor Yellow
Write-Host "   - Đảm bảo .env KHÔNG có trong danh sách" -ForegroundColor Yellow
Write-Host "   - Đảm bảo node_modules/ KHÔNG có trong danh sách" -ForegroundColor Yellow
Write-Host ""

$continue = Read-Host "✅ Bạn đã kiểm tra và muốn tiếp tục? (y/n)"
if ($continue -ne "y" -and $continue -ne "Y") {
    Write-Host "❌ Hủy bỏ push." -ForegroundColor Red
    exit
}

# Bước 2: Git Add
Write-Host ""
Write-Host "📦 Step 2: Adding files..." -ForegroundColor Cyan
git add .
Write-Host "✅ Files added" -ForegroundColor Green
Write-Host ""

# Bước 3: Git Commit
Write-Host "💬 Step 3: Committing..." -ForegroundColor Cyan
$commitMessage = @"
feat: Prepare backend for deployment

- Add production-ready server.js with CORS, health check, graceful shutdown
- Add comprehensive documentation (README, DEPLOYMENT_GUIDE, BACKEND_TODO, etc)
- Add test scripts (PowerShell script, Postman collection)
- Add .env.example template for environment variables
- Update package.json with engines specification
- Add .gitignore to protect sensitive data
- Ready for Render/Railway deployment
"@

git commit -m $commitMessage
Write-Host "✅ Committed" -ForegroundColor Green
Write-Host ""

# Bước 4: Git Push
Write-Host "🚀 Step 4: Pushing to GitHub..." -ForegroundColor Cyan
Write-Host "   Branch: feature/rbac" -ForegroundColor Yellow

$push = Read-Host "Tiếp tục push? (y/n)"
if ($push -ne "y" -and $push -ne "Y") {
    Write-Host "❌ Hủy bỏ push. Commit đã được tạo local." -ForegroundColor Yellow
    exit
}

git push origin feature/rbac

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 PUSH THÀNH CÔNG!" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Kiểm tra trên GitHub:" -ForegroundColor White
    Write-Host "      https://github.com/NguyenToanThanh/group12-project/tree/feature/rbac/backend" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   2. Verify các files mới:" -ForegroundColor White
    Write-Host "      - README.md" -ForegroundColor Gray
    Write-Host "      - DEPLOYMENT_GUIDE.md" -ForegroundColor Gray
    Write-Host "      - .env.example" -ForegroundColor Gray
    Write-Host "      - .gitignore" -ForegroundColor Gray
    Write-Host "      - test-api.ps1" -ForegroundColor Gray
    Write-Host "      - postman_collection.json" -ForegroundColor Gray
    Write-Host ""
    Write-Host "   3. Bắt đầu deploy:" -ForegroundColor White
    Write-Host "      Đọc file DEPLOYMENT_GUIDE.md để deploy lên Render/Railway" -ForegroundColor Gray
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ PUSH FAILED!" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "🔍 Có thể do:" -ForegroundColor Yellow
    Write-Host "   - Chưa config git credentials" -ForegroundColor White
    Write-Host "   - Branch không tồn tại trên remote" -ForegroundColor White
    Write-Host "   - Cần pull trước khi push" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Thử:" -ForegroundColor Cyan
    Write-Host "   git pull origin feature/rbac --rebase" -ForegroundColor Gray
    Write-Host "   git push origin feature/rbac" -ForegroundColor Gray
    Write-Host ""
}
