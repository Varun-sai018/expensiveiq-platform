# start-backend.ps1
# Kills any process on port 8085 then starts the Spring Boot backend

$PORT = 8085

Write-Host "Checking for processes on port $PORT..." -ForegroundColor Cyan

$pids = (netstat -ano | Select-String ":$PORT\s.*LISTENING") -replace '.*LISTENING\s+', '' | Sort-Object -Unique

foreach ($pid in $pids) {
    $pid = $pid.Trim()
    if ($pid -match '^\d+$' -and $pid -ne '0') {
        Write-Host "Killing PID $pid on port $PORT..." -ForegroundColor Yellow
        try {
            taskkill /PID $pid /F 2>&1 | Out-Null
            Write-Host "  Killed PID $pid" -ForegroundColor Green
        } catch {
            Write-Host "  Could not kill PID $pid (may need admin)" -ForegroundColor Red
        }
    }
}

Start-Sleep -Seconds 1
Write-Host "Starting Spring Boot backend on port $PORT..." -ForegroundColor Green
Set-Location "$PSScriptRoot\backend"
mvn spring-boot:run
