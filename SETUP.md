# CONFIGURAÇÃO PARA DESENVOLVEDORES

## ⚠️ PRIMEIRO SETUP (OBRIGATÓRIO)

Após clonar este repositório, você DEVE configurar a API antes de executar o projeto:

### 1. Configure o token da API
```bash
# Windows PowerShell
.\setup.ps1

# Linux/Mac
./setup.sh
```

### 2. OU configure manualmente:
```bash
# Copie o template
cp public/assets/js/config.example.js public/assets/js/config.js
```

### 3. Edite o arquivo config.js
- Abra `public/assets/js/config.js`
- Substitua `'YOUR_API_TOKEN_HERE'` pelo seu token da TMDB
- Obtenha o token em: https://www.themoviedb.org/settings/api

### 4. Execute o projeto
```bash
npm install
npm start
```

## 🔒 SEGURANÇA

- **NUNCA** commite o arquivo `config.js`
- O arquivo já está no `.gitignore`
- Mantenha seu token privado
- Use sempre o `config.example.js` como referência

## 🤝 CONTRIBUINDO

1. Clone o repositório
2. Execute o setup (passos acima)
3. Faça suas alterações
4. Commit (o `config.js` será automaticamente ignorado)
5. Push para sua branch
6. Abra um Pull Request

## ❓ PROBLEMAS COMUNS

**Erro: "Token da API não configurado"**
- Solução: Configure o `config.js` seguindo os passos acima

**Erro: "Failed to fetch"**
- Verifique se o token está correto
- Verifique sua conexão com a internet
- Confirme se o servidor está rodando (`npm start`)
