// Trabalho Interdisciplinar 1 - Aplicações Web
//
// Esse módulo realiza o registro de novos usuários e login para aplicações com 
// backend baseado em API REST provida pelo JSONServer
// Os dados de usuário estão localizados no arquivo db.json que acompanha este projeto.
//
// Autor: Rommel Vieira Carneiro (rommelcarneiro@gmail.com)
// Data: 09/09/2024
//
// Código LoginApp  

// Página inicial de Login
const LOGIN_URL = "/pages/login.html";
let RETURN_URL = "/pages/index.html";
const API_URL = '/usuarios';

// Objeto para o banco de dados de usuários baseado em JSON
var db_usuarios = {};

// Objeto para o usuário corrente
var usuarioCorrente = {};

// Inicializa a aplicação de Login
function initLoginApp () {
    let pagina = window.location.pathname;
    if (pagina != LOGIN_URL) {
        // CONFIGURA A URLS DE RETORNO COMO A PÁGINA ATUAL
        sessionStorage.setItem('returnURL', pagina);
        RETURN_URL = pagina;

        // INICIALIZA USUARIOCORRENTE A PARTIR DE DADOS NO LOCAL STORAGE, CASO EXISTA
        usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
        if (usuarioCorrenteJSON) {
            usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        } else {
            window.location.href = LOGIN_URL;
        }

        // REGISTRA LISTENER PARA O EVENTO DE CARREGAMENTO DA PÁGINA PARA ATUALIZAR INFORMAÇÕES DO USUÁRIO
        document.addEventListener('DOMContentLoaded', function () {
            showUserInfo('userInfo');
        });
    }
    else {
        // VERIFICA SE A URL DE RETORNO ESTÁ DEFINIDA NO SESSION STORAGE, CASO CONTRARIO USA A PÁGINA INICIAL
        let returnURL = sessionStorage.getItem('returnURL');
        RETURN_URL = returnURL || RETURN_URL;
        
        // INICIALIZA BANCO DE DADOS DE USUÁRIOS
        carregarUsuarios(() => {
            console.log('Usuários carregados...');
        });
    }
};

// Função para carregar os usuários
function carregarUsuarios(callback) {
    fetch(API_URL)
    .then(response => response.json())
    .then(data => {
        db_usuarios = data;
        callback();
    })
    .catch(error => {
        console.error('Erro ao ler usuários via API JSONServer:', error);
        displayMessage("Erro ao ler usuários");
    });
}

// Verifica se o login do usuário está ok e, se positivo, direciona para a página inicial
function loginUser (login, senha) {

    // Verifica todos os itens do banco de dados de usuarios 
    // para localizar o usuário informado no formulario de login
    for (var i = 0; i < db_usuarios.length; i++) {
        var usuario = db_usuarios[i];

        // Se encontrou login, carrega usuário corrente e salva no Session Storage
        if (login == usuario.login && senha == usuario.senha) {

            Object.assign(usuarioCorrente, usuario);

            // Salva os dados do usuário corrente no Session Storage, mas antes converte para string
            sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));

            // Retorna true para usuário encontrado
            return true;
        }
    }

    // Se chegou até aqui é por que não encontrou o usuário e retorna falso
    return false;
}

// Função de logout
function logoutUser () {
    sessionStorage.removeItem('usuarioCorrente');
    window.location = LOGIN_URL;
}

// Função para adicionar um novo usuário
function addUser (nome, login, senha, email) {
    // Verifica se algum dos campos está vazio
    if (!nome || !login || !senha || !email) {
        displayMessage("Todos os campos devem ser preenchidos.");
        return; // Impede a criação do usuário
    }

    let usuario = { "login": login, "senha": senha, "nome": nome, "email": email };

    fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
    .then(response => response.json())
    .then(data => {
        // Verifica se o usuário foi criado com sucesso
        if (data.id) {  // Supondo que o objeto de resposta contenha um campo `id` quando inserido com sucesso
            db_usuarios.push(data); // Adiciona o novo usuário ao banco de dados local
            displayMessage("Usuário inserido com sucesso!");
            
            // Redireciona para o login após o registro
            setTimeout(() => {
                logoutUser();  // Desloga o usuário e redireciona para a página de login
            }, 2000);  // Espera 2 segundos antes de redirecionar
        } else {
            displayMessage("Erro ao registrar usuário.");
        }
    })
    .catch(error => {
        console.error('Erro ao inserir usuário via API JSONServer:', error);
        displayMessage("Erro ao inserir usuário");
    });
}

// Função para exibir informações do usuário corrente
function showUserInfo (element) {
    var elemUser = document.getElementById(element);
    if (elemUser) {
        elemUser.innerHTML = `${usuarioCorrente.nome} (${usuarioCorrente.login}) 
                    <a onclick="logoutUser()">❌</a>`;
    }
}

// Função para exibir mensagens
function displayMessage(msg) {
    alert(msg);  // Exibe uma mensagem de alerta (pode ser substituído por um modal ou outro tipo de notificação)
}

// Inicializa as estruturas utilizadas pelo LoginApp
initLoginApp();