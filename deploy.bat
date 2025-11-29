@echo off
echo 开始部署3D实验室项目...

echo.
echo 1. 构建项目...
npm run build

echo.
echo 2. 部署到Vercel...
vercel --prod

echo.
echo 部署完成！
pause
