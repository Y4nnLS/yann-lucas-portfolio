param(
    [Parameter(Mandatory = $true, Position = 0)]
    [ValidateSet('setup', 'backend', 'frontend')]
    [string]$Action,
    [switch]$Reload
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$backendRoot = Join-Path $projectRoot 'backend'
$frontendRoot = Join-Path $projectRoot 'frontend'
$pythonPath = Join-Path $backendRoot '.venv\Scripts\python.exe'
$localEnvPath = Join-Path $projectRoot '.env.local'

function Invoke-Checked {
    param([string]$Command, [string[]]$CommandArguments)
    & $Command @CommandArguments
    if ($LASTEXITCODE -ne 0) {
        throw "Falha ao executar $Command (codigo $LASTEXITCODE)."
    }
}

function Copy-EnvIfMissing {
    param([string]$Template, [string]$Destination)
    if (-not (Test-Path -LiteralPath $Destination)) {
        Copy-Item -LiteralPath $Template -Destination $Destination
    }
}

if ($Action -eq 'setup') {
    Get-Command python, node, npm.cmd -ErrorAction Stop | Out-Null
    Copy-EnvIfMissing (Join-Path $projectRoot '.env.example') (Join-Path $projectRoot '.env')
    Copy-EnvIfMissing (Join-Path $projectRoot '.env.local.example') $localEnvPath
    Copy-EnvIfMissing (Join-Path $frontendRoot '.env.local.example') (Join-Path $frontendRoot '.env.local')

    if (-not (Test-Path -LiteralPath $pythonPath)) {
        Invoke-Checked 'python' @('-m', 'venv', (Join-Path $backendRoot '.venv'))
    }
    Invoke-Checked $pythonPath @('-m', 'pip', 'install', '-r', (Join-Path $backendRoot 'requirements.txt'))
    Push-Location $frontendRoot
    try {
        Invoke-Checked 'npm.cmd' @('ci', '--no-audit', '--no-fund')
    } finally {
        Pop-Location
    }
}

if (-not (Test-Path -LiteralPath $localEnvPath)) {
    throw 'Prepare o ambiente primeiro: powershell -ExecutionPolicy Bypass -File .\scripts\dev.ps1 setup'
}

if ($Action -in @('setup', 'backend')) {
    if (-not (Test-Path -LiteralPath $pythonPath)) {
        throw 'Ambiente Python ausente. Execute o comando setup primeiro.'
    }
    Push-Location $backendRoot
    try {
        Invoke-Checked $pythonPath @('-m', 'alembic', 'upgrade', 'head')
        Invoke-Checked $pythonPath @('-m', 'app.db.seed')
        if ($Action -eq 'backend') {
            Write-Host 'API: http://localhost:8000/docs | Ctrl+C para encerrar.'
            $serverArguments = @('-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000')
            if ($Reload) {
                $serverArguments += '--reload'
            }
            Invoke-Checked $pythonPath $serverArguments
        }
    } finally {
        Pop-Location
    }
}

if ($Action -eq 'frontend') {
    if (-not (Test-Path -LiteralPath (Join-Path $frontendRoot 'node_modules\next'))) {
        throw 'Dependencias do front-end ausentes. Execute o comando setup primeiro.'
    }
    Push-Location $frontendRoot
    try {
        Write-Host 'Site: http://localhost:3000 | Ctrl+C para encerrar.'
        Invoke-Checked 'npm.cmd' @('run', 'dev', '--', '--hostname', 'localhost', '--port', '3000')
    } finally {
        Pop-Location
    }
}

if ($Action -eq 'setup') {
    Write-Host 'Ambiente preparado. Execute backend e frontend em dois terminais.'
    Write-Host 'Login administrativo: ADMIN_EMAIL e ADMIN_PASSWORD do arquivo .env.'
}
