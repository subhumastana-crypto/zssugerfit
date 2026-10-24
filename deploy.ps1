Write-Host "Deploying SUGAR FIT updates to GitHub & Vercel..." -ForegroundColor Cyan
Set-Location -Path $PSScriptRoot
git push -u origin main --force
Write-Host "Successfully pushed! Vercel is now deploying your updated site." -ForegroundColor Green
