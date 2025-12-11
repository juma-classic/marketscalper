# PowerShell script to fix SignalsCenter.tsx

$filePath = "src\components\signals\SignalsCenter.tsx"

Write-Host "Reading file..." -ForegroundColor Cyan
$content = Get-Content $filePath -Raw

Write-Host "Applying fixes..." -ForegroundColor Yellow

# Fix 1: Replace numberOfRuns with maxTrades in the for loop (line 567)
$content = $content -replace 'for \(let run = 1; run <= numberOfRuns; run\+\+\)', 'for (let run = 1; run <= maxTrades; run++)'

# Fix 2: Replace numberOfRuns in console.log (line 568)
$content = $content -replace 'console\.log\(`📍 Run \$\{run\}/\$\{numberOfRuns\}', 'console.log(`📍 Trade ${run}/${maxTrades}'

# Fix 3: Replace numberOfRuns in the if condition (line 614)
$content = $content -replace 'if \(run < numberOfRuns\)', 'if (run < maxTrades)'

# Fix 4: Change "Run" to "Trade" in the completion log
$content = $content -replace 'console\.log\(`✅ Run \$\{run\} completed:', 'console.log(`✅ Trade ${run} completed:'

# Fix 5: Change "Run" to "Trade" in error logs
$content = $content -replace 'console\.error\(`❌ Run \$\{run\} failed', 'console.error(`❌ Trade ${run} failed'

# Fix 6: Add break on win for martingale (insert after the stake increase logic)
$pattern = '(\s+)// Increase stake on failed trade if martingale is enabled\s+if \(enableMartingale\) \{\s+currentStake = currentStake \* multiplier;\s+\}'
$replacement = '$1// Increase stake on failed trade if martingale is enabled
$1if (enableMartingale) {
$1    currentStake = currentStake * multiplier;
$1}
$1
$1// Stop on win when martingale is enabled
$1if (enableMartingale && tradeWon) {
$1    console.log(`✅ Win! Stopping martingale sequence.`);
$1    break;
$1}'

$content = $content -replace $pattern, $replacement

# Fix 7: Add tradeWon variable declaration at the start of the loop
$pattern = '(for \(let run = 1; run <= maxTrades; run\+\+\) \{\s+console\.log)'
$replacement = 'for (let run = 1; run <= maxTrades; run++) {
            let tradeWon = false;
            console.log'
$content = $content -replace $pattern, $replacement

# Fix 8: Set tradeWon in the callback
$pattern = '(tradeResult => \{\s+console\.log\(`✅ Trade \$\{run\} completed:`, tradeResult\.profit\);\s+totalProfit \+= tradeResult\.profit \|\| 0;)'
$replacement = 'tradeResult => {
                    console.log(`✅ Trade ${run} completed:`, tradeResult.profit);
                    totalProfit += tradeResult.profit || 0;
                    tradeWon = tradeResult.isWon || false;'
$content = $content -replace $pattern, $replacement

Write-Host "Writing fixed content back to file..." -ForegroundColor Green
$content | Set-Content $filePath -NoNewline

Write-Host "✅ File fixed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "  1. Replaced 'numberOfRuns' with 'maxTrades'" -ForegroundColor White
Write-Host "  2. Changed 'Run' to 'Trade' in logs" -ForegroundColor White
Write-Host "  3. Added 'tradeWon' variable tracking" -ForegroundColor White
Write-Host "  4. Added break on win for martingale" -ForegroundColor White
Write-Host ""
Write-Host "Run 'npm run build' to test the changes" -ForegroundColor Yellow
