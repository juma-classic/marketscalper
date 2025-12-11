# PowerShell script to fix remaining numberOfRuns in handleAutoTrade

$filePath = "src\components\signals\SignalsCenter.tsx"

Write-Host "Reading file..." -ForegroundColor Cyan
$content = Get-Content $filePath -Raw

Write-Host "Fixing auto-trade function..." -ForegroundColor Yellow

# Fix the auto-trade console.log that still has numberOfRuns
$content = $content -replace 'console\.log\(`🤖 Auto-trade run \$\{run\}/\$\{numberOfRuns\}`\);', 'console.log(`🤖 Auto-trade run ${run}/${maxTrades}`);'

Write-Host "Writing fixed content back to file..." -ForegroundColor Green
$content | Set-Content $filePath -NoNewline

Write-Host "✅ File fixed successfully!" -ForegroundColor Green
