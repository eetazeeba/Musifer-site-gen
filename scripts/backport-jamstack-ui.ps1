param(
  [ValidateSet('dry-run', 'apply')]
  [string]$Mode = 'dry-run',
  [string]$SourceBranch = '',
  [string]$BaseBranch = '',
  [string]$ManifestPath = 'scripts/backport-jamstack-ui.paths.json',
  [string]$ReportPath = '',
  [switch]$AllowUnresolved
)

$ErrorActionPreference = 'Stop'

function Normalize-RepoPath {
  param([string]$Path)
  return ($Path -replace '\\', '/').Trim()
}

function Test-PathPattern {
  param(
    [string]$Path,
    [string]$Pattern
  )
  $normalizedPath = Normalize-RepoPath $Path
  $normalizedPattern = (Normalize-RepoPath $Pattern) -replace '\*\*', '*'
  $wildcard = [System.Management.Automation.WildcardPattern]::new(
    $normalizedPattern,
    [System.Management.Automation.WildcardOptions]::IgnoreCase
  )
  return $wildcard.IsMatch($normalizedPath)
}

function Test-MatchesAny {
  param(
    [string]$Path,
    [array]$Patterns
  )
  foreach ($pattern in $Patterns) {
    if (Test-PathPattern -Path $Path -Pattern $pattern) {
      return $true
    }
  }
  return $false
}

function Write-List {
  param(
    [string]$Title,
    [array]$Items,
    [string]$ValueProperty = ''
  )
  Write-Host ""
  Write-Host $Title
  if (-not $Items -or $Items.Count -eq 0) {
    Write-Host '  (none)'
    return
  }

  foreach ($item in $Items) {
    if ($ValueProperty -and $item.PSObject.Properties.Name -contains $ValueProperty) {
      Write-Host ("  - " + $item.$ValueProperty)
    } else {
      Write-Host ("  - " + $item)
    }
  }
}

if (-not (Test-Path $ManifestPath)) {
  throw "Manifest not found: $ManifestPath"
}

$manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json

if ([string]::IsNullOrWhiteSpace($SourceBranch)) {
  $SourceBranch = $manifest.sourceBranch
}
if ([string]::IsNullOrWhiteSpace($BaseBranch)) {
  $BaseBranch = $manifest.baseBranch
}

if ([string]::IsNullOrWhiteSpace($SourceBranch) -or [string]::IsNullOrWhiteSpace($BaseBranch)) {
  throw 'Source and base branches must be set either by parameters or manifest defaults.'
}

$allowMappings = @($manifest.allowMappings)
$blockedPatterns = @($manifest.blockedPatterns)
$manualPatterns = @($manifest.manualReviewPatterns)

$changedRaw = git diff --name-only "$BaseBranch...$SourceBranch"
if ($LASTEXITCODE -ne 0) {
  throw "Failed to diff branches: $BaseBranch...$SourceBranch"
}

$changedFiles = @(
  $changedRaw |
    Where-Object { $_ -and $_.Trim() -ne '' } |
    ForEach-Object { Normalize-RepoPath $_ }
)

$allowMapBySource = @{}
foreach ($mapping in $allowMappings) {
  $source = Normalize-RepoPath $mapping.source
  $allowMapBySource[$source] = $mapping
}

$selected = New-Object System.Collections.Generic.List[object]
$blocked = New-Object System.Collections.Generic.List[object]
$manual = New-Object System.Collections.Generic.List[object]
$unmatched = New-Object System.Collections.Generic.List[object]

foreach ($file in $changedFiles) {
  if ($allowMapBySource.ContainsKey($file)) {
    $mapping = $allowMapBySource[$file]
    $selected.Add([PSCustomObject]@{
      source = $file
      target = Normalize-RepoPath $mapping.target
      reason = $mapping.reason
    })
    continue
  }

  if (Test-MatchesAny -Path $file -Patterns $manualPatterns) {
    $manual.Add($file)
    continue
  }

  if (Test-MatchesAny -Path $file -Patterns $blockedPatterns) {
    $blocked.Add($file)
    continue
  }

  $unmatched.Add($file)
}

$report = [PSCustomObject]@{
  generatedAt = (Get-Date).ToString('s')
  mode = $Mode
  sourceBranch = $SourceBranch
  baseBranch = $BaseBranch
  changedFiles = $changedFiles
  selected = $selected
  blocked = $blocked
  manualReview = $manual
  unmatched = $unmatched
}

Write-Host "Mode: $Mode"
Write-Host "Base...Source: $BaseBranch...$SourceBranch"
Write-Host "Changed files detected: $($changedFiles.Count)"

Write-List -Title 'Selected for backport (allowlist mappings):' -Items $selected -ValueProperty 'source'
Write-List -Title 'Blocked by denylist:' -Items $blocked
Write-List -Title 'Needs manual review (likely 11ty-dependent):' -Items $manual
Write-List -Title 'Reviewed but not allowlisted:' -Items $unmatched

if ($ReportPath) {
  $reportDir = Split-Path -Parent $ReportPath
  if ($reportDir) {
    New-Item -ItemType Directory -Force $reportDir | Out-Null
  }

  $md = New-Object System.Collections.Generic.List[string]
  $md.Add('# Jamstack UI Backport Report') | Out-Null
  $md.Add('') | Out-Null
  $md.Add("- Generated: $($report.generatedAt)") | Out-Null
  $md.Add("- Mode: $Mode") | Out-Null
  $md.Add("- Base...Source: $BaseBranch...$SourceBranch") | Out-Null
  $md.Add("- Changed files scanned: $($changedFiles.Count)") | Out-Null
  $md.Add('') | Out-Null

  $md.Add('## Selected For Backport') | Out-Null
  if ($selected.Count -eq 0) {
    $md.Add('- (none)') | Out-Null
  } else {
    foreach ($item in $selected) {
      $md.Add("- `"$($item.source)`" -> `"$($item.target)`" ($($item.reason))") | Out-Null
    }
  }
  $md.Add('') | Out-Null

  $md.Add('## Blocked By Denylist') | Out-Null
  if ($blocked.Count -eq 0) {
    $md.Add('- (none)') | Out-Null
  } else {
    foreach ($item in $blocked) {
      $md.Add("- `"$item`"") | Out-Null
    }
  }
  $md.Add('') | Out-Null

  $md.Add('## Manual Review Required') | Out-Null
  if ($manual.Count -eq 0) {
    $md.Add('- (none)') | Out-Null
  } else {
    foreach ($item in $manual) {
      $md.Add("- `"$item`"") | Out-Null
    }
  }
  $md.Add('') | Out-Null

  $md.Add('## Reviewed But Not Allowlisted') | Out-Null
  if ($unmatched.Count -eq 0) {
    $md.Add('- (none)') | Out-Null
  } else {
    foreach ($item in $unmatched) {
      $md.Add("- `"$item`"") | Out-Null
    }
  }

  $encoding = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllLines((Resolve-Path -LiteralPath .\).Path + '/' + (Normalize-RepoPath $ReportPath), $md, $encoding)
  Write-Host ""
  Write-Host "Wrote report: $ReportPath"
}

if ($Mode -eq 'dry-run') {
  return
}

if ($selected.Count -eq 0) {
  Write-Host ""
  Write-Host 'No allowlisted files to backport. Nothing to apply.'
  return
}

if (($manual.Count -gt 0 -or $unmatched.Count -gt 0) -and -not $AllowUnresolved) {
  throw 'Unresolved 11ty/manual dependencies detected. Re-run with -AllowUnresolved after handling manual files.'
}

$copied = New-Object System.Collections.Generic.List[object]
$utf8NoBom = New-Object System.Text.UTF8Encoding($false)

foreach ($item in $selected) {
  $sourceSpec = "$SourceBranch`:$($item.source)"
  $content = git show $sourceSpec
  if ($LASTEXITCODE -ne 0) {
    throw "Failed to read source file from branch: $sourceSpec"
  }

  $targetPath = Join-Path (Get-Location) ($item.target -replace '/', [System.IO.Path]::DirectorySeparatorChar)
  $targetDir = Split-Path -Parent $targetPath
  if ($targetDir) {
    New-Item -ItemType Directory -Force $targetDir | Out-Null
  }

  $text = [string]::Join("`n", $content)
  [System.IO.File]::WriteAllText($targetPath, $text, $utf8NoBom)

  $copied.Add($item)
}

Write-Host ""
Write-Host 'Apply summary:'
foreach ($item in $copied) {
  Write-Host ("  - " + $item.source + ' -> ' + $item.target)
}
