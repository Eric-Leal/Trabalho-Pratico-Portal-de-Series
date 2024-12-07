import API_TOKEN from '../js/config.js';

document.addEventListener('DOMContentLoaded', () => {
    carregarSeries();

    document.getElementById('searchBtn').addEventListener('click', () => {
        paginaAtual = 1; // Resetar para a primeira página ao realizar uma busca
        carregarSeries(true);
    });

    document.querySelectorAll('.form-check-input').forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            paginaAtual = 1; // Redefine para a página 1 ao alterar um filtro
            carregarSeries();
        });
    });

    document.getElementById('nextPageBtn').addEventListener('click', () => {
        paginaAtual++;
        carregarSeries();
    });

    document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (paginaAtual > 1) {
            paginaAtual--;
            carregarSeries();
        }
    });
});

const URL = 'https://api.themoviedb.org/3/';
let paginaAtual = 1;
const limitePorPagina = 18; // Número máximo de séries por página

async function carregarSeries(filtroPesquisa = false) {
    const nomeSerie = document.getElementById('searchSeries').value.trim();
    const categoriasSelecionadas = obterCategoriasSelecionadas();

    let seriesFiltradas = [];
    let paginaBusca = paginaAtual;

    const url = filtroPesquisa && nomeSerie
        ? `${URL}search/tv?query=${nomeSerie}&language=pt-BR&page=${paginaBusca}`
        : `${URL}trending/tv/week?language=pt-BR&page=${paginaBusca}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_TOKEN}`
            }
        });
        const data = await response.json();

        // Filtrar séries pelas categorias selecionadas
        seriesFiltradas = data.results.filter(serie => {
            if (categoriasSelecionadas.length === 0) return true; // Sem filtro
            return categoriasSelecionadas.every(cat => serie.genre_ids.includes(cat));
        });

        // Se a quantidade de séries filtradas for menor que 18, carrega mais séries
        let seriesParaExibir = [];
        let paginaAtualBusca = paginaBusca;

        // Enquanto não tiver 18 séries, carrega mais da próxima página
        while (seriesParaExibir.length < limitePorPagina) {
            // Garantir que não ultrapasse o limite da página
            const urlProximaPagina = `${URL}trending/tv/week?language=pt-BR&page=${paginaAtualBusca}`;
            const responseProximaPagina = await fetch(urlProximaPagina, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`
                }
            });

            const dataProximaPagina = await responseProximaPagina.json();

            const seriesPagina = dataProximaPagina.results.filter(serie => {
                if (categoriasSelecionadas.length === 0) return true; // Sem filtro
                return categoriasSelecionadas.every(cat => serie.genre_ids.includes(cat));
            });

            // Adicionar as séries da página à lista
            seriesParaExibir = [...seriesParaExibir, ...seriesPagina];

            if (paginaAtualBusca >= dataProximaPagina.total_pages || seriesParaExibir.length >= limitePorPagina) break;
            paginaAtualBusca++; // Incrementa para carregar a próxima página
        }

        // Limitar a exibição a 18 séries
        seriesParaExibir = seriesParaExibir.slice(0, limitePorPagina);

        // Se não houver séries que correspondem aos filtros, não mostrar nada
        if (seriesParaExibir.length === 0) {
            document.getElementById('cardsExplorador').innerHTML = ''; // Deixa o espaço de cards vazio
            return;
        }

        // Log mostrando quais séries estão sendo carregadas
        console.log("Séries carregadas para a página " + paginaAtual + ":", seriesParaExibir.map(serie => serie.name));

        // Atualizar os cards na interface
        renderizarSeries(seriesParaExibir);

        // Configurar botões de paginação
        document.getElementById('prevPageBtn').disabled = paginaAtual === 1;
        document.getElementById('nextPageBtn').disabled = paginaBusca >= data.total_pages;

        window.scrollTo(0, 0);
    } catch (error) {
        console.error('Erro ao carregar séries:', error);
        document.getElementById('cardsExplorador').innerHTML = ` 
            <p class="text-danger">Erro ao carregar as séries. Tente novamente mais tarde.</p>
        `;
    }
}

function renderizarSeries(series) {
    const cardsContainer = document.getElementById('cardsExplorador');
    cardsContainer.innerHTML = '';

    const cardsHTML = series.map(serie => {
        console.log('Networks:', serie.networks);  // Verificando o conteúdo de networks

        // Usar a lógica segura para buscar a plataforma
        let plataformas = Array.isArray(serie.networks) && serie.networks.length > 0
            ? serie.networks[0].name
            : 'Sem plataforma disponível';

        return `
            <div class="col-lg-4 col-md-6 col-sm-6">
                <div class="card mb-3">
                    <img src="https://image.tmdb.org/t/p/w500${serie.backdrop_path}" class="card-img-top" alt="${serie.name}">
                    <div class="card-body">
                        <h5 class="card-title">${serie.name}</h5>
                        <p class="card-text mb-0">${serie.first_air_date}</p>
                        <p class="card-text mb-2">Plataforma: ${plataformas}</p>
                        <a href="../pages/serie.html?id=${serie.id}" class="btn btn-primary">Ver mais</a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    cardsContainer.innerHTML = cardsHTML;
}

function obterCategoriasSelecionadas() {
    const categoriasSelecionadas = [];

    // Categorias selecionadas pelos checkboxes
    if (document.getElementById('genre1').checked) categoriasSelecionadas.push(28);  // Ação
    if (document.getElementById('genre2').checked) categoriasSelecionadas.push(35);  // Comédia
    if (document.getElementById('genre3').checked) categoriasSelecionadas.push(18);  // Drama
    if (document.getElementById('genre4').checked) categoriasSelecionadas.push(10765); // Ficção científica / Fantasia
    if (document.getElementById('genre5').checked) categoriasSelecionadas.push(9648); // Mistério
    if (document.getElementById('genre6').checked) categoriasSelecionadas.push(16);   // Animação
    if (document.getElementById('genre7').checked) categoriasSelecionadas.push(80);   // Crime

    return categoriasSelecionadas;
}
