import API_TOKEN from '../js/config.js';

const URL = 'https://api.themoviedb.org/3/';

let currentPage = 1;
let totalPages = 1; 
let currentSearchTerm = '';

document.addEventListener('DOMContentLoaded', () => {
    carregarSeries();

    document.getElementById('searchBtn').addEventListener('click', () => {
        currentPage = 1; 
        currentSearchTerm = document.getElementById('searchSeries').value.trim();
        carregarSeries(true);
    });

    const checkboxes = document.querySelectorAll('.form-check-input');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', () => {
            currentPage = 1; 
            carregarSeries();
        });
    }

    document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            carregarSeries(currentSearchTerm !== '');
        }
    });

    document.getElementById('nextPageBtn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            carregarSeries(currentSearchTerm !== '');
        }
    });
});

function carregarSeries(filtroPesquisa = false) {
    const categoriasSelecionadas = obterCategoriasSelecionadas();

    let url = `${URL}discover/tv?include_adult=false&language=pt-BR&page=${currentPage}&sort_by=vote_average.desc&vote_count.gte=200`;

    if (filtroPesquisa && currentSearchTerm) {
        url = `${URL}search/tv?query=${currentSearchTerm}&language=pt-BR&page=${currentPage}`;
    }

    if (categoriasSelecionadas.length > 0) {
        const genreParam = categoriasSelecionadas.join(',');
        url += `&with_genres=${genreParam}`;
    }

    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);

    fetch(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`,
        },
    })
    .then((res) => res.json())
    .then((data) => {
        totalPages = data.total_pages; 
        atualizarBotoesNavegacao();

        let str = '';

        for (let i = 0; i < 12 && i < data.results.length; i++) {
            const serie = data.results[i];

            const imageUrl = serie.backdrop_path ? `https://image.tmdb.org/t/p/w500${serie.backdrop_path}` : '../assets/images/LogoImageTeste.png'; // Substitua './assets/placeholder-image.jpg' pelo caminho da sua imagem de placeholder local

            const imageClass = serie.backdrop_path ? 'card-img-top' : 'card-img-top placeholder-img';

            fetch(`${URL}tv/${serie.id}?&language=pt-BR`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`,
                },
            })
            .then((res) => res.json())
            .then((series) => {
                let plataforma = series.networks.length > 0 ? series.networks[0].name : 'Não disponível';
                str += `
                    <div class="col-lg-4 col-md-6 col-sm-6">
                        <div class="card mb-3">
                            <img src="${imageUrl}" class="${imageClass}" alt="${serie.name}">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text mb-0">${serie.first_air_date}</p>
                                <p class="card-text mb-2">Plataforma: ${plataforma}</p>
                                <a href="../pages/serie.html?id=${serie.id}" class="btn btn-primary">Ver mais</a>
                            </div>
                        </div>
                    </div>
                `;
                document.getElementById('cardsExplorador').innerHTML = str;
            })
            .catch((error) => {
                console.error('Erro ao carregar detalhes das séries:', error);
            });
        }
    })
    .catch((error) => {
        console.error('Erro ao buscar as séries:', error);
    });
}

function obterCategoriasSelecionadas() {
    const categoriasSelecionadas = [];

    if (document.getElementById('genre1').checked) categoriasSelecionadas.push(35);  // Comédia
    if (document.getElementById('genre2').checked) categoriasSelecionadas.push(18);  // Drama
    if (document.getElementById('genre3').checked) categoriasSelecionadas.push(10765);  // Fantasia
    if (document.getElementById('genre4').checked) categoriasSelecionadas.push(9648);  // Mistério
    if (document.getElementById('genre5').checked) categoriasSelecionadas.push(16);  // Animação
    if (document.getElementById('genre6').checked) categoriasSelecionadas.push(80);  // Crime
    if (document.getElementById('genre7').checked) categoriasSelecionadas.push(10759);  // Ação e Aventura
    if (document.getElementById('genre8').checked) categoriasSelecionadas.push(99);  // Documentário
    if (document.getElementById('genre9').checked) categoriasSelecionadas.push(10751);  // Família
    if (document.getElementById('genre10').checked) categoriasSelecionadas.push(10762);  // Infantil
    if (document.getElementById('genre11').checked) categoriasSelecionadas.push(10764);  // Reality


    return categoriasSelecionadas;
}

function atualizarBotoesNavegacao() {
    document.getElementById('prevPageBtn').disabled = currentPage <= 1;
    document.getElementById('nextPageBtn').disabled = currentPage >= totalPages;
}
