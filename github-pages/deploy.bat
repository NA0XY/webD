@echo off
echo ========================================
echo    FinanceIQ GitHub Pages Deployer
echo ========================================
echo.

set /p REPO_NAME="Enter your GitHub repository name: "
set /p USERNAME="Enter your GitHub username: "

echo.
echo Creating GitHub repository...
git init
git add .
git commit -m "Initial commit - FinanceIQ Dashboard"

echo.
echo Adding GitHub remote...
git remote add origin https://github.com/%USERNAME%/%REPO_NAME%.git

echo.
echo Pushing to GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo    Deployment Complete!
echo ========================================
echo.
echo Your site will be available at:
echo https://%USERNAME%.github.io/%REPO_NAME%/
echo.
echo To enable GitHub Pages:
echo 1. Go to your repository on GitHub
echo 2. Click Settings ^> Pages
echo 3. Select "main" branch as source
echo 4. Save and wait a few minutes
echo.
pause