# ============================================================================
# PHASE 1: VISUAL REFRESH - AUTOMATIC IMPLEMENTATION
# Hawaii Discovery Hub - Hybrid Redesign
# ============================================================================

Write-Host "🎨 PHASE 1: VISUAL REFRESH - AUTO IMPLEMENTATION" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommandPath
$publicDir = "$projectRoot\public"
$cssFile = "$publicDir\css\style.css"

Write-Host "📁 Project Directory: $projectRoot" -ForegroundColor Green
Write-Host ""

# ============================================================================
# STEP 1: ADD FONT AWESOME TO ALL HTML FILES
# ============================================================================

Write-Host "Step 1/2: Adding Font Awesome to HTML files..." -ForegroundColor Yellow

$fontAwesomeLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />'
$styleLink = '<link rel="stylesheet" href="/css/style.css" />'

$htmlFiles = @(
    "index.html",
    "directory.html",
    "for-businesses.html",
    "dashboard.html",
    "login.html",
    "register.html"
)

foreach ($file in $htmlFiles) {
    $filePath = "$publicDir\$file"

    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw

        if ($content -notmatch "font-awesome") {
            $newContent = $content -replace [regex]::Escape($styleLink), "$fontAwesomeLink`n  $styleLink"
            Set-Content -Path $filePath -Value $newContent -Encoding UTF8
            Write-Host "  ✅ $file - Font Awesome added" -ForegroundColor Green
        } else {
            Write-Host "  ⏭️  $file - Font Awesome already present" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ❌ $file - NOT FOUND" -ForegroundColor Red
    }
}

Write-Host ""

# ============================================================================
# STEP 2: UPDATE CSS WITH NEW COLORS AND STYLES
# ============================================================================

Write-Host "Step 2/2: Updating CSS file..." -ForegroundColor Yellow

if (Test-Path $cssFile) {
    $cssContent = Get-Content $cssFile -Raw

    # CSS Variables
    $cssVars = ':root {
  --primary: #0D9488;
  --primary-dark: #0F766E;
  --secondary: #F59E0B;
  --accent: #06B6D4;
  --text: #1F2937;
  --text-muted: #6B7280;
  --bg-light: #FFFFFF;
  --bg-pale: #F0F9FF;
  --border: #E5E7EB;
}'

    # Modern CSS Styles
    $modernCSS = '
/* ========== PHASE 1: VISUAL REFRESH ========== */

/* Hero Section - Modern Teal Gradient */
.hero {
  background: linear-gradient(135deg, #0D9488 0%, #0F766E 100%) !important;
  color: white !important;
  padding: 6rem 2rem !important;
  text-align: center !important;
  position: relative !important;
  overflow: hidden !important;
  min-height: 500px !important;
}

.hero::before {
  content: "";
  position: absolute;
  top: -50%;
  right: -10%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;
}

.hero h1 {
  font-size: clamp(2.5rem, 7vw, 4rem) !important;
  font-weight: 700 !important;
  margin-bottom: 1.5rem !important;
  line-height: 1.2 !important;
  letter-spacing: -0.03em !important;
  color: white !important;
  position: relative;
  z-index: 2;
}

.hero p {
  font-size: 1.2rem !important;
  color: rgba(255,255,255,0.95) !important;
  margin-bottom: 2rem !important;
  line-height: 1.6 !important;
  position: relative;
  z-index: 2;
}

/* Buttons - Modern Teal */
.btn {
  border-radius: 8px !important;
  padding: 1rem 2.5rem !important;
  font-weight: 600 !important;
  transition: all 0.3s !important;
  cursor: pointer !important;
  border: none !important;
  text-decoration: none !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 0.5rem !important;
}

.btn:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 10px 25px rgba(13, 148, 136, 0.3) !important;
}

.btn-primary {
  background: #0D9488 !important;
  color: white !important;
}

.btn-primary:hover {
  background: #0F766E !important;
}

.btn-secondary {
  background: #F59E0B !important;
  color: white !important;
}

.btn-secondary:hover {
  background: #D97706 !important;
}

/* Links */
a {
  color: #0D9488 !important;
  transition: color 0.3s !important;
}

a:hover {
  color: #0F766E !important;
}

/* Cards - Modern with shadows */
.listing-card,
[class*="card"] {
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
  transition: all 0.3s !important;
  border: 1px solid #E5E7EB !important;
  padding: 1.5rem !important;
  background: white !important;
}

.listing-card:hover,
[class*="card"]:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
}

/* Sections - Improved spacing */
.section {
  padding: 5rem 2rem !important;
}

.section h2 {
  font-size: clamp(1.75rem, 4vw, 2.5rem) !important;
  font-weight: 700 !important;
  margin-bottom: 1.5rem !important;
  color: #1F2937 !important;
}

.section p {
  color: #6B7280 !important;
  line-height: 1.8 !important;
}

/* Typography - Modern sans-serif */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif !important;
  line-height: 1.6 !important;
  color: #1F2937 !important;
  font-size: 16px !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: -0.02em !important;
  line-height: 1.2 !important;
}

h1 {
  font-size: clamp(2rem, 5vw, 3.5rem) !important;
}

h2 {
  font-size: clamp(1.75rem, 4vw, 2.75rem) !important;
}

h3 {
  font-size: 1.5rem !important;
}

p {
  margin-bottom: 1rem !important;
  line-height: 1.8 !important;
}
'

    # Remove existing :root if it exists
    $cssContent = $cssContent -replace ':root\s*\{[^}]*\}', ''

    # Add new styles at the beginning
    $updatedCSS = $cssVars + $modernCSS + "`n`n" + $cssContent

    Set-Content -Path $cssFile -Value $updatedCSS -Encoding UTF8
    Write-Host "  ✅ CSS file updated with modern styles" -ForegroundColor Green

} else {
    Write-Host "  ❌ CSS file not found at: $cssFile" -ForegroundColor Red
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ PHASE 1 IMPLEMENTATION COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Summary of changes:" -ForegroundColor Cyan
Write-Host "  • Font Awesome added to all 6 HTML files" -ForegroundColor White
Write-Host "  • CSS colors updated to teal palette" -ForegroundColor White
Write-Host "  • Hero section modernized with gradient" -ForegroundColor White
Write-Host "  • Buttons, cards, typography updated" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Test in browser at: http://localhost:5000" -ForegroundColor White
Write-Host "  2. Verify new teal colors and modern design" -ForegroundColor White
Write-Host "  3. Check mobile responsiveness" -ForegroundColor White
Write-Host "  4. Commit and deploy to Railway" -ForegroundColor White
Write-Host ""
Write-Host "Git commands:" -ForegroundColor Yellow
Write-Host "  git add ." -ForegroundColor Gray
Write-Host "  git commit -m 'Phase 1: Visual refresh - teal colors and modern design'" -ForegroundColor Gray
Write-Host "  git push origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Phase 1 complete! Ready for testing!" -ForegroundColor Green
