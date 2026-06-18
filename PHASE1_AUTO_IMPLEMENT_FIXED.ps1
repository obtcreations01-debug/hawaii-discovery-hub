# ============================================================================
# PHASE 1: VISUAL REFRESH - CORRECTED FOR EXISTING COLOR VARIABLES
# ============================================================================

Write-Host "🎨 PHASE 1: VISUAL REFRESH - CORRECTED" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommandPath
$publicDir = "$projectRoot\public"
$cssFile = "$publicDir\css\style.css"

Write-Host "📁 Updating CSS colors to teal palette..." -ForegroundColor Green
Write-Host ""

if (Test-Path $cssFile) {
    $cssContent = Get-Content $cssFile -Raw

    # Replace Hawaii theme colors with modern teal palette
    $cssContent = $cssContent -replace "--ocean-blue:\s*#[0-9a-fA-F]{6};", "--ocean-blue: #0D9488; /* Updated to teal */"
    $cssContent = $cssContent -replace "--ocean-deep:\s*#[0-9a-fA-F]{6};", "--ocean-deep: #0F766E; /* Updated dark teal */"
    $cssContent = $cssContent -replace "--sunset:\s*#[0-9a-fA-F]{6};", "--sunset: #06B6D4; /* Updated to cyan accent */"

    # Add new accent color if not present
    if ($cssContent -notmatch "--accent:") {
        $cssContent = $cssContent -replace "(--leaf:[^;]+;)", "`$1`n  --accent: #06B6D4;"
    }

    # Update font stack to modern sans-serif
    if ($cssContent -match "font-family:[^;]*;") {
        $cssContent = $cssContent -replace "font-family:\s*[^;]+;", "font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif;"
    }

    # Add modern styles for hero section
    $modernHeroCSS = @"

/* ========== PHASE 1: MODERN VISUAL REFRESH ========== */

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

/* Links - Teal */
a {
  color: #0D9488 !important;
  transition: color 0.3s !important;
}

a:hover {
  color: #0F766E !important;
}

/* Cards - Modern shadows */
.listing-card {
  border-radius: 12px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08) !important;
  transition: all 0.3s !important;
}

.listing-card:hover {
  transform: translateY(-4px) !important;
  box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
}

/* Sections - Better spacing */
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

/* Typography improvements */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif !important;
  line-height: 1.6 !important;
  color: #1F2937 !important;
  font-size: 16px !important;
}

h1, h2, h3, h4, h5, h6 {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: -0.02em !important;
  line-height: 1.2 !important;
}
"@

    # Append modern styles at end of file
    $cssContent = $cssContent + $modernHeroCSS

    # Save the updated CSS
    Set-Content -Path $cssFile -Value $cssContent -Encoding UTF8
    Write-Host "✅ CSS colors updated to teal palette" -ForegroundColor Green
    Write-Host "✅ Modern styles added" -ForegroundColor Green
    Write-Host "✅ Typography modernized" -ForegroundColor Green

} else {
    Write-Host "❌ CSS file not found!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "✅ PHASE 1 CORRECTED AND COMPLETE!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Changes made:" -ForegroundColor Cyan
Write-Host "  • Ocean blue → Teal (#0D9488)" -ForegroundColor White
Write-Host "  • Ocean deep → Dark teal (#0F766E)" -ForegroundColor White
Write-Host "  • Sunset → Cyan accent (#06B6D4)" -ForegroundColor White
Write-Host "  • Modern hero section added" -ForegroundColor White
Write-Host "  • Button styles updated" -ForegroundColor White
Write-Host "  • Typography modernized" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next: Hard refresh browser (Ctrl+Shift+R)" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Ready for testing!" -ForegroundColor Green
