#!/bin/bash

# Script de configuração inicial do projeto
echo "🚀 Configurando Portal de Séries..."

# Verifica se o config.js já existe
if [ -f "public/assets/js/config.js" ]; then
    echo "✅ Arquivo config.js já existe"
else
    echo "📋 Criando arquivo config.js a partir do template..."
    cp public/assets/js/config.example.js public/assets/js/config.js
    echo "⚠️  IMPORTANTE: Edite o arquivo public/assets/js/config.js e adicione seu token da API!"
fi

# Instala dependências
echo "📦 Instalando dependências..."
npm install

echo "✅ Configuração concluída!"
echo ""
echo "📝 Próximos passos:"
echo "1. Obtenha seu token em: https://www.themoviedb.org/settings/api"
echo "2. Edite public/assets/js/config.js e substitua 'YOUR_API_TOKEN_HERE'"
echo "3. Execute: npm start"
echo "4. Acesse: http://localhost:3000"
