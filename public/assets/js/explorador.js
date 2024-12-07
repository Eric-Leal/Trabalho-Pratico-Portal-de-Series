import API_TOKEN from '../js/config.js';

document.addEventListener('DOMContentLoaded', () => {
    carregarSeries();

    // Adicionando eventos aos elementos de filtro
    document.getElementById('searchBtn').addEventListener('click', () => {
        carregarSeries(true); // Passa 'true' para indicar que é uma pesquisa
    });

    // Evento para os checkboxes de categoria
    const checkboxes = document.querySelectorAll('.form-check-input');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener('change', () => {
            carregarSeries(); // Carregar as séries com base nas categorias selecionadas
        });
    }
});

const URL = 'https://api.themoviedb.org/3/';

let listaGeneros = [
    { id: 28, name: 'Ação' },
    { id: 35, name: 'Comédia' },
    { id: 18, name: 'Drama' },
    { id: 10765, name: 'Fantasia' },
    { id: 80, name: 'Crime' },
    { id: 10759, name: 'Aventura' },
    { id: 99, name: 'Documentário' },
    { id: 10751, name: 'Família' },
    { id: 10762, name: 'Infantil' },
    { id: 10763, name: 'Notícias' },
    { id: 10764, name: 'Reality' },
    { id: 10767, name: 'Talk Show' },
    { id: 10402, name: 'Música' },
    { id: 10752, name: 'Guerra' },
    { id: 10768, name: 'História' }
];

// Para garantir que os gêneros estejam carregados corretamente, podemos logar a lista
console.log('Lista de Gêneros:', listaGeneros);

function carregarSeries(filtroPesquisa = false) {
    const nomeSerie = document.getElementById('searchSeries').value.trim();
    const categoriasSelecionadas = obterCategoriasSelecionadas();

    let url = `${URL}discover/tv?include_adult=false&language=pt-BR&page=1&sort_by=vote_average.desc&vote_count.gte=200`; // URL com parâmetros fornecidos

    // Se houver filtro de pesquisa por nome
    if (filtroPesquisa && nomeSerie) {
        url = `${URL}search/tv?query=${nomeSerie}&language=pt-BR&page=1`; // URL para pesquisa por nome
    }

    // Adicionando filtros de gênero à URL diretamente no fetch
    if (categoriasSelecionadas.length > 0) {
        const genreParam = categoriasSelecionadas.join(',');
        url += `&with_genres=${genreParam}`;
    }

    fetch(url, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    })
    .then(res => res.json())
    .then(data => {
        let str = '';

        for (let i = 0; i < 12; i++) {
            const serie = data.results[i];

            // Filtra pelas categorias selecionadas, se houver
            if (categoriasSelecionadas.length > 0) {
                const genres = serie.genre_ids || [];
                let matchGenres = true;
                for (let j = 0; j < categoriasSelecionadas.length; j++) {
                    if (!genres.includes(categoriasSelecionadas[j])) {
                        matchGenres = false;
                        break;
                    }
                }
                if (!matchGenres) continue; // Ignora se não tiver match com as categorias
            }

            fetch(`${URL}tv/${serie.id}?&language=pt-BR`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`
                }
            })
            .then(res => res.json())
            .then(series => {
                // Seleciona apenas a primeira plataforma (rede)
                let plataforma = series.networks.length > 0 ? series.networks[0].name : 'Não disponível';

                str += `
                    <div class="col-lg-4 col-md-6 col-sm-6">
                        <div class="card mb-3">
                            <img src="https://image.tmdb.org/t/p/w500${serie.backdrop_path}" class="card-img-top" alt="${serie.name}">
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
            .catch(error => {
                console.error('Erro ao carregar detalhes das séries:', error);
            });
        }
    })
    .catch(error => {
        console.error('Erro ao buscar as séries:', error);
    });
}

function obterCategoriasSelecionadas() {
    const categoriasSelecionadas = [];

    // Verifica os checkboxes selecionados e associa com os IDs dos gêneros
    if (document.getElementById('genre1').checked) categoriasSelecionadas.push(35); // Comédia
    if (document.getElementById('genre2').checked) categoriasSelecionadas.push(18); // Drama
    if (document.getElementById('genre3').checked) categoriasSelecionadas.push(10765); // Fantasia
    if (document.getElementById('genre4').checked) categoriasSelecionadas.push(9648); // Mistério
    if (document.getElementById('genre5').checked) categoriasSelecionadas.push(16); // Animação
    if (document.getElementById('genre6').checked) categoriasSelecionadas.push(80); // Crime

    return categoriasSelecionadas;
}
