# Copy Neon → Railway with Railway column order (handles schema drift).
$ErrorActionPreference = "Stop"
$pgBin = if (Test-Path "C:\Program Files\PostgreSQL\18\bin\psql.exe") {
  "C:\Program Files\PostgreSQL\18\bin"
} else {
  "C:\Program Files\PostgreSQL\17\bin"
}
$psql = Join-Path $pgBin "psql.exe"

$neonUrl = $env:NEON_URL
$railwayUrl = $env:RAILWAY_URL
if (-not $neonUrl -or -not $railwayUrl) {
  throw "Set NEON_URL and RAILWAY_URL env vars"
}

$outDir = Join-Path $PSScriptRoot "bin"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$tables = @(
  "Trip",
  "Traveler",
  "Enquiry",
  "Blog",
  "GalleryImage",
  "Faq",
  "SiteReview",
  "PlatformStat",
  "GooglePlaceCache",
  "CustomerProfile",
  "RateLimit",
  "OtpCode",
  "Booking",
  "BookingInstallment",
  "Payment"
)

function Invoke-PsqlFile([string]$url, [string]$sql) {
  $tmp = Join-Path $outDir ("_cmd_" + [guid]::NewGuid().ToString("N") + ".sql")
  [System.IO.File]::WriteAllText($tmp, $sql)
  try {
    & $psql $url -v ON_ERROR_STOP=1 -f $tmp
    if ($LASTEXITCODE -ne 0) { throw "psql failed (exit $LASTEXITCODE) for: $sql" }
  } finally {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  }
}

function Get-ColumnList([string]$url, [string]$table) {
  $sql = "SELECT string_agg(quote_ident(column_name), ', ' ORDER BY ordinal_position) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '$table';"
  $tmp = Join-Path $outDir ("_cols_" + [guid]::NewGuid().ToString("N") + ".sql")
  [System.IO.File]::WriteAllText($tmp, $sql)
  try {
    $out = & $psql $url -v ON_ERROR_STOP=1 -t -A -f $tmp
    if ($LASTEXITCODE -ne 0) { throw "column list failed for $table" }
    return $out.Trim()
  } finally {
    Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  }
}

Write-Host "Truncating Railway data tables..."
$truncateList = ($tables | ForEach-Object { '"' + $_ + '"' }) -join ", "
Invoke-PsqlFile $railwayUrl ("TRUNCATE TABLE " + $truncateList + " RESTART IDENTITY CASCADE;")

foreach ($table in $tables) {
  $cols = Get-ColumnList $railwayUrl $table
  if (-not $cols) { throw "No columns for $table" }
  $bin = (Join-Path $outDir ($table + ".bin")).Replace('\', '/')
  Write-Host ("Dumping Neon." + $table + " (" + $cols + ") ...")
  # Export Neon rows projected into Railway column order
  Invoke-PsqlFile $neonUrl ('\copy (SELECT ' + $cols + ' FROM "' + $table + '") TO ''' + $bin + ''' WITH (FORMAT binary)')
  $size = (Get-Item $bin).Length
  Write-Host ("  bytes=" + $size + " -> Railway." + $table)
  Invoke-PsqlFile $railwayUrl ('\copy "' + $table + '" (' + $cols + ') FROM ''' + $bin + ''' WITH (FORMAT binary)')
}

Write-Host "Verifying counts..."
Invoke-PsqlFile $railwayUrl @'
SELECT 'Trip' AS t, COUNT(*) FROM "Trip"
UNION ALL SELECT 'Enquiry', COUNT(*) FROM "Enquiry"
UNION ALL SELECT 'Booking', COUNT(*) FROM "Booking"
UNION ALL SELECT 'Blog', COUNT(*) FROM "Blog"
UNION ALL SELECT 'SiteReview', COUNT(*) FROM "SiteReview"
UNION ALL SELECT 'Traveler', COUNT(*) FROM "Traveler"
UNION ALL SELECT 'Payment', COUNT(*) FROM "Payment"
UNION ALL SELECT 'Faq', COUNT(*) FROM "Faq"
UNION ALL SELECT 'BookingInstallment', COUNT(*) FROM "BookingInstallment"
ORDER BY 1;
'@

Write-Host "Done."
