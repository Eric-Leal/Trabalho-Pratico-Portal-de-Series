# Portal de Séries

Portal web para explorar séries de TV usando a API do The Movie Database (TMDB).

## 🚀 Configuração Rápida

**⚠️ IMPORTANTE:** Antes de executar o projeto, você DEVE configurar o token da API.

### Guia de Instalação Completo
📋 **Siga as instruções em:** [INSTALACAO.md](./INSTALACAO.md)

## 🚀 Como executar o projeto

### Pré-requisitos
- Node.js instalado
- Token da API do The Movie Database

### Configuração da API

1. **Obtenha um token da API:**
   - Acesse [The Movie Database](https://www.themoviedb.org/)
   - Crie uma conta ou faça login
   - Vá para [Configurações da API](https://www.themoviedb.org/settings/api)
   - Copie seu "API Read Access Token"

2. **Configure o token no projeto:**
   ```bash
   # Copie o arquivo de exemplo
   cp public/assets/js/config.example.js public/assets/js/config.js
   ```
   
   - Abra o arquivo `public/assets/js/config.js`
   - Substitua `'YOUR_API_TOKEN_HERE'` pelo seu token real da API

### Executando o projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor:**
   ```bash
   npm start
   ```

3. **Acesse no navegador:**
   ```
   http://localhost:3000
   ```

## ⚠️ Importante

- **Nunca commite o arquivo `config.js`** - ele contém informações sensíveis
- O arquivo `config.js` já está no `.gitignore`
- Use sempre o `config.example.js` como referência
- Mantenha seu token da API seguro e privado

## 🔧 Funcionalidades

- Explorar séries populares
- Buscar séries por nome
- Visualizar detalhes das séries
- Interface responsiva
