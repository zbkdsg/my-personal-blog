@echo off
setlocal
cd /d "%~dp0"

set "PROXY=http://127.0.0.1:7897"
set "PORT=7897"

echo ==========================================
echo  Push: local -^> GitHub -^> Cloudflare
echo ==========================================
echo.

git status --porcelain > "%TEMP%\gitpush_status.txt" 2>nul
for %%A in ("%TEMP%\gitpush_status.txt") do set "SIZE=%%~zA"

if "%SIZE%"=="0" (
  echo [1/3] No changes. Push existing commits.
  goto :push
)

echo [1/3] Changed files:
git status --short
echo.

set "MSG=%~1"
if "%MSG%"=="" set "MSG=update %DATE% %TIME%"

echo [2/3] Commit: %MSG%
git add -A
git commit -m "%MSG%"
if errorlevel 1 (
  echo [ERROR] commit failed.
  goto :end
)

:push
echo.
echo [3/3] Pushing...
powershell -NoProfile -Command "$c=New-Object Net.Sockets.TcpClient; if($c.ConnectAsync('127.0.0.1',%PORT%).Wait(500)){exit 0}else{exit 1}" >nul 2>&1
if errorlevel 1 (
  git push
) else (
  git -c http.proxy=%PROXY% push
)

if errorlevel 1 (
  echo.
  echo [ERROR] push failed. Check: proxy on? GitHub login?
  goto :end
)

echo.
echo [DONE] Pushed. Cloudflare builds in about 2 minutes.

:end
echo.
pause
endlocal
