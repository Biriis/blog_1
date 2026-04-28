# GitHub Upload Script
# Usage: Run this script in PowerShell

Write-Host "========================================="
Write-Host "   GitHub Upload Script"
Write-Host "========================================="
Write-Host ""

$githubUsername = "Biriis"
$repoName = "blog"

Write-Host "Username: $githubUsername"
Write-Host "Repository: $repoName"
Write-Host ""

Write-Host "Enter your GitHub Personal Access Token:"
Write-Host "(Get it from: https://github.com/settings/tokens)"
$token = Read-Host

if ($token -eq "") {
    Write-Host "Token cannot be empty!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Checking Git repository..."

$isGitRepo = git rev-parse --git-dir 2>$null
if (-not $isGitRepo) {
    Write-Host "Error: Not a Git repository" -ForegroundColor Red
    exit 1
}

Write-Host "Git repository found" -ForegroundColor Green
Write-Host ""

Write-Host "Adding remote repository..."
git remote remove origin 2>$null | Out-Null
$remoteUrl = "https://" + $token + "@github.com/" + $githubUsername + "/" + $repoName + ".git"
git remote add origin $remoteUrl
Write-Host "Remote added" -ForegroundColor Green
Write-Host ""

Write-Host "Renaming branch to main..."
git branch -M main
Write-Host "Branch renamed" -ForegroundColor Green
Write-Host ""

Write-Host "Pushing to GitHub..."
git push -u origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================="
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host "========================================="
    Write-Host ""
    Write-Host "Repository: https://github.com/$githubUsername/$repoName"
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "Upload failed!" -ForegroundColor Red
    Write-Host "Please check:"
    Write-Host "  1. Token is valid"
    Write-Host "  2. Repository name is available"
    Write-Host "  3. Network connection"
    Write-Host ""
}
