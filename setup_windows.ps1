<<<<<<< HEAD
# Stop on errors like 'set -e'
$ErrorActionPreference = 'Stop'

Write-Host "Running npm install..."
npm install

Write-Host "Setting up Package Manager (Astral UV)..."
$installerScript = Invoke-RestMethod -Uri 'https://astral.sh/uv/install.ps1'
Invoke-Expression $installerScript

# Navigate to chatbot folder
Set-Location -Path "chatbot"

Write-Host "Running 'uv sync'..."
uv sync

# Determine script directory
$scriptDir = Get-Location

# Detect Python executable in venv
$winPython = Join-Path $scriptDir ".venv\Scripts\python.exe"
$posixPython = Join-Path $scriptDir ".venv/bin/python3"

if (Test-Path $winPython) {
    $pythonExe = $winPython
} elseif (Test-Path $posixPython) {
    $pythonExe = $posixPython
} else {
    $pythonExe = "python"  # fallback to system python
}

# Run Python script
$scriptPath = Join-Path $scriptDir "script.py"
Write-Host "Running Python script with: $pythonExe $scriptPath"
& $pythonExe $scriptPath

Write-Host "`nSetup complete!"
Write-Host "Activate virtual environment using:"
if (Test-Path $winPython) {
    Write-Host ".\chatbot\.venv\Scripts\Activate.ps1"
} else {
    Write-Host "source ./chatbot/.venv/bin/activate"
}

# Return to original directory
Set-Location -Path ".."

=======
# Stop on errors like 'set -e'
$ErrorActionPreference = 'Stop'

Write-Host "Running npm install..."
npm install

Write-Host "Setting up Package Manager (Astral UV)..."
$installerScript = Invoke-RestMethod -Uri 'https://astral.sh/uv/install.ps1'
Invoke-Expression $installerScript

# Navigate to chatbot folder
Set-Location -Path "chatbot"

Write-Host "Running 'uv sync'..."
uv sync

# Determine script directory
$scriptDir = Get-Location

# Detect Python executable in venv
$winPython = Join-Path $scriptDir ".venv\Scripts\python.exe"
$posixPython = Join-Path $scriptDir ".venv/bin/python3"

if (Test-Path $winPython) {
    $pythonExe = $winPython
} elseif (Test-Path $posixPython) {
    $pythonExe = $posixPython
} else {
    $pythonExe = "python"  # fallback to system python
}

# Run Python script
$scriptPath = Join-Path $scriptDir "script.py"
Write-Host "Running Python script with: $pythonExe $scriptPath"
& $pythonExe $scriptPath

Write-Host "`nSetup complete!"
Write-Host "Activate virtual environment using:"
if (Test-Path $winPython) {
    Write-Host ".\chatbot\.venv\Scripts\Activate.ps1"
} else {
    Write-Host "source ./chatbot/.venv/bin/activate"
}

# Return to original directory
Set-Location -Path ".."

>>>>>>> 8a94dd1b160b1f998bb1cba5f679c5047a642fa4
