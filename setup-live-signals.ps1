# Live Signals Project Setup Script
Write-Host "Setting up Live Signals Project Structure..." -ForegroundColor Green

# Create component directories
$componentDirs = @(
    "src/components/signals/__tests__",
    "src/hooks/__tests__",
    "src/services/__tests__",
    "src/utils/__tests__",
    "src/__tests__/integration",
    "src/__tests__/performance",
    "public/sounds"
)

foreach ($dir in $componentDirs) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "✓ Created: $dir" -ForegroundColor Cyan
    }
}

# Create placeholder sound files
$sounds = @(
    "entry-signal.mp3",
    "warning.mp3",
    "critical-alert.mp3",
    "win.mp3",
    "loss.mp3"
)

foreach ($sound in $sounds) {
    $soundPath = "public/sounds/$sound"
    if (!(Test-Path $soundPath)) {
        New-Item -ItemType File -Path $soundPath -Force | Out-Null
        Write-Host "✓ Created: $soundPath" -ForegroundColor Cyan
    }
}

# Create README for sounds
$soundsReadme = @"
# Sound Files

Download free sound effects from:
- https://freesound.org/
- https://mixkit.co/free-sound-effects/
- https://www.zapsplat.com/

## Required Sounds:
1. entry-signal.mp3 - Pleasant notification sound
2. warning.mp3 - Attention-grabbing beep
3. critical-alert.mp3 - Urgent alarm sound
4. win.mp3 - Success/celebration sound
5. loss.mp3 - Gentle failure sound

## Format:
- MP3 format
- Sample rate: 44.1kHz
- Bitrate: 128kbps
- Duration: 1-3 seconds
"@

Set-Content -Path "public/sounds/README.md" -Value $soundsReadme

Write-Host "`nProject structure created successfully!" -ForegroundColor Green
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "1. Download sound files (see public/sounds/README.md)" -ForegroundColor White
Write-Host "2. Review LIVE_SIGNALS_IMPLEMENTATION_PLAN.md" -ForegroundColor White
Write-Host "3. Start with Phase 1: npm run dev" -ForegroundColor White
Write-Host "`nReady to code!" -ForegroundColor Green
