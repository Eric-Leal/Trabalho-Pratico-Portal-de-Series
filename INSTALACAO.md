# 🚀 Configuração Inicial do Projeto

## ⚠️ IMPORTANTE
Antes de executar o projeto, você DEVE configurar o token da API do TMDB.

## 📋 Passo a Passo

### 1. Obter Token da API
1. Acesse [The Movie Database](https://www.themoviedb.org/)
2. Crie uma conta ou faça login
3. Vá para [Configurações da API](https://www.themoviedb.org/settings/api)
4. Copie seu **"API Read Access Token"**

### 2. Configurar o Token no Projeto

#### Windows (PowerShell):
```powershell
# Copie o arquivo template
Copy-Item "public/assets/js/config.example.js" "public/assets/js/config.js"

# Abra o arquivo e edite o token
notepad public/assets/js/config.js
```

#### Linux/Mac:
```bash
# Copie o arquivo template
cp public/assets/js/config.example.js public/assets/js/config.js

# Abra o arquivo e edite o token
nano public/assets/js/config.js
# ou
code public/assets/js/config.js
```

### 3. Editar o Token
No arquivo `public/assets/js/config.js`, substitua:
```javascript
const API_TOKEN = 'YOUR_API_TOKEN_HERE';
```

Por:
```javascript
const API_TOKEN = 'seu_token_real_aqui';
```

### 4. Instalar Dependências
```bash
npm install
```

### 5. Executar o Projeto
```bash
npm start
```

### 6. Acessar o Site
Abra seu navegador e acesse:
```
http://localhost:8080
```

## ✅ Pronto!
Seu Portal de Séries está funcionando com dados reais da API do TMDB!
