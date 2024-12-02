import API_TOKEN from '../js/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const parametros = new URLSearchParams(window.location.search);
    const idSerie = parametros.get('id');
    if (idSerie) {
        carregarDadosSerie(idSerie);
    } else {
        console.error('ID da série não encontrado');
    }
});

function carregarDadosSerie(id) {
    const URL = `https://api.themoviedb.org/3/tv/${id}?&language=pt-BR`;

    fetch(URL, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        return resposta.json();
    })
    .then(dados => {
        document.querySelector('#nomeSerie').innerText = dados.name;
        document.querySelector('#imagemSerie').src = `https://image.tmdb.org/t/p/w500${dados.poster_path}`;
        document.querySelector('#genero').innerHTML = `<span class="destaque">Gênero:</span> ${dados.genres.map(genero => genero.name).join(', ')}`;
        document.querySelector('#dataLancamento').innerHTML = `<span class="destaque">Data de Lançamento:</span> ${dados.first_air_date}`;
        document.querySelector('#sinopse').innerHTML = `<span class="destaque">Sinopse:</span> ${dados.overview}`;
        document.querySelector('#plataforma').innerHTML = `<span class="destaque">Plataforma:</span> ${dados.networks.map(rede => rede.name).join(', ')}`;
        document.querySelector('#temporadas').innerHTML = `<span class="destaque">Temporadas:</span> ${dados.number_of_seasons}`;

        carregarElenco(id);
    })
    .catch(erro => {
        console.error('Erro ao buscar os dados da série:', erro);
    });
}

function carregarElenco(id) {
    const urlElenco = `https://api.themoviedb.org/3/tv/${id}/credits?&language=pt-BR`;

    fetch(urlElenco, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    })
    .then(resposta => {
        if (!resposta.ok) {
            throw new Error(`HTTP error! status: ${resposta.status}`);
        }
        return resposta.json();
    })
    .then(dadosElenco => {
        const listaDeAtores = dadosElenco.cast;
        const tamanhoDoGrupo = 4;
        let contadorDeSlides = 0;

        for (let i = 0; i < listaDeAtores.length; i += tamanhoDoGrupo) {
            let htmlDoSlide = `<div class="carousel-item ${contadorDeSlides === 0 ? 'active' : ''}">`;
            contadorDeSlides++;

            htmlDoSlide += `<div class="row text-center">`;
            for (let j = i; j < i + tamanhoDoGrupo && j < listaDeAtores.length; j++) {
                const ator = listaDeAtores[j];
                htmlDoSlide += `
                    <div class="col-md-6 col-lg-3 mb-4">
                        <div class="card">
                            <img src="https://image.tmdb.org/t/p/w500${ator.profile_path}" class="card-img-top elenco-img" alt="${ator.name}">
                            <div class="card-body">
                                <h4 class="card-text mb-0">${ator.name}</h4>
                                <p>${ator.character}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
            htmlDoSlide += `</div>`; 
            htmlDoSlide += `</div>`; 

            document.getElementById('carouselActors').innerHTML += htmlDoSlide;
        }
    })
    .catch(erro => {
        console.error('Erro ao buscar o elenco da série:', erro);
    });
}
