# Script de configuração inicial do projeto para Windows
Write-Host "🚀 Configurando Portal de Séries..." -ForegroundColor Green

# Verifica se o config.js já existe
if (Test-Path "public/assets/js/config.js") {
    Write-Host "✅ Arquivo config.js já existe" -ForegroundColor Green
} else {
    Write-Host "📋 Criando arquivo config.js a partir do template..." -ForegroundColor Yellow
    Copy-Item "public/assets/js/config.example.js" "public/assets/js/config.js"
    Write-Host "⚠️  IMPORTANTE: Edite o arquivo public/assets/js/config.js e adicione seu token da API!" -ForegroundColor Red
}

# Instala dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Blue
npm install

Write-Host "✅ Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Obtenha seu token em: https://www.themoviedb.org/settings/api"
Write-Host "2. Edite public/assets/js/config.js e substitua 'YOUR_API_TOKEN_HERE'"
Write-Host "3. Execute: npm start"
Write-Host "4. Acesse: http://localhost:3000"
