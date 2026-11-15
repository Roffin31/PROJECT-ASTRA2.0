$ErrorActionPreference = 'Stop'
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
Set-Location $PSScriptRoot

Write-Host 'Installing dependencies...'
npm install

Write-Host 'Starting Project Astra in development mode...'
npm run dev -- --host 0.0.0.0
