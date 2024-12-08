document.addEventListener('DOMContentLoaded', () => {
    carouselSeries();
    novasSeries();
    seriesFavoritas();
    carregarInformacoesAluno(); 
});

const URL = 'https://api.themoviedb.org/3/';
import API_TOKEN from '../js/config.js';

function carregarInformacoesAluno() {
    fetch('/aluno/1')  // Chama o endpoint '/aluno' para pegar os dados do aluno
    .then(res => res.json()) // Converte a resposta em JSON
    .then(dados => {
        console.log(dados);

        const nome = dados.nome;
        const curso = dados.curso;
        const turma = dados.turma;
        const sobre = dados.sobre;
        const id = dados.id;

        // Verifique se os elementos existem antes de preenchê-los
        const nomeAluno = document.getElementById('nomeAluno');
        const cursoAluno = document.getElementById('cursoAluno');
        const turmaAluno = document.getElementById('turmaAluno');
        const sobreAluno = document.getElementById('sobreAluno');

        if (nomeAluno) nomeAluno.textContent = nome;
        if (cursoAluno) cursoAluno.textContent = curso;
        if (turmaAluno) turmaAluno.textContent = turma;
        if (sobreAluno) sobreAluno.textContent = sobre;
    })
    .catch(error => {
        console.error('Erro ao carregar as informações do aluno:', error);
    });
}



function carouselSeries() {
    fetch(`${URL}tv/top_rated?language=en-US&page=1`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    })
    .then(res => res.json())
    .then(data => {
        let str = '';
        for (let i = 0; i < 4; i++) {
            let serie = data.results[i];
            const imagem = serie.backdrop_path ? `https://image.tmdb.org/t/p/original${serie.backdrop_path}` : '../assets/images/LogoImageTeste.png'; // Placeholder caso não tenha imagem
            const imageClass = (serie.backdrop_path) ? '' : 'placeholder-image'; // Aplica a classe apenas se for o placeholder
            str += `
                <div class="carouselSerie carousel-item ${i === 0 ? 'active' : ''} ">
                    <img src="${imagem}" class="d-block w-100 ${imageClass}" alt="${serie.name}">
                    <div class="carousel-caption d-none d-md-block">
                        <h5 class="carouseldesc">
                            <a href="pages/serie.html?id=${serie.id}">${serie.name}</a>
                        </h5>
                    </div>
                </div>
            `;
        }
        const telaCarousel = document.getElementById('telaCarousel');
        if (telaCarousel) {
            telaCarousel.innerHTML = str;
        }
    })
    .catch(error => {
        console.error('Erro ao buscar as séries:', error);
    });
}

function novasSeries() {
    fetch(`${URL}trending/tv/week?language=pt-BR&page=1`, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    })
    .then(res => res.json())
    .then(data => {
        let str = '';
        for (let i = 0; i < 4; i++) {
            let serie = data.results[i];
            const imagem = serie.backdrop_path ? `https://image.tmdb.org/t/p/w500${serie.backdrop_path}` : '../assets/images/LogoImageTeste.png'; // Placeholder caso não tenha imagem
            const imageClass = (serie.backdrop_path) ? '' : 'placeholder-image'; // Aplica a classe apenas se for o placeholder
            fetch(`${URL}/tv/${serie.id}?&language=pt-BR`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`
                }
            })
            .then(res => res.json())
            .then(series => {
                let plataformas = series.networks.length > 0 ? series.networks[0].name : 'Indisponível';

                str += `
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card mb-3">
                            <img src="${imagem}" class="card-img-top ${imageClass}" alt="${serie.name}">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text mb-0">${serie.first_air_date}</p>
                                <p class="card-text mb-2">Plataforma: ${plataformas} </p> 
                                <a href="../pages/serie.html?id=${serie.id}" class="btn btn-primary">Ver mais</a>
                            </div>
                        </div>
                    </div>
                `;
                const telaNovasSeries = document.getElementById('telaNovasSeries');
                if (telaNovasSeries) {
                    telaNovasSeries.innerHTML = str;
                }
            })
        }
    })
    .catch(error => {
        console.error('Erro ao buscar as séries:', error);
    });
}

function seriesFavoritas() {
    fetch('/favoritos', {
        method: 'GET',
    })
    .then(res => res.json())
    .then(favoritos => {
        let str = '';
        let indicatorsStr = '';
        let count = 0;

        if (favoritos.length === 0) {

            str = `<div class="col-12 text-center">
                        <p><strong>Nenhuma série favoritada</strong></p>
                    </div>`;
            
            const telaSeriesFavoritas = document.getElementById('telaSeriesFavoritas');
            if (telaSeriesFavoritas) {
                telaSeriesFavoritas.innerHTML = str;
            }
            return;
        }

        function ajustarTamanhoDoCarousel() {
            const larguraTela = window.innerWidth;
            if (larguraTela < 574) {
                return 1; 
            } else if (larguraTela < 992) {
                return 2; 
            } else {
                return 4; 
            }
        }

        let tamanhoDoCarousel = ajustarTamanhoDoCarousel();

        for (let i = 0; i < favoritos.length; i++) {
            const idFavorito = favoritos[i].idSerie;
            fetch(`https://api.themoviedb.org/3/tv/${idFavorito}?&language=pt-BR`, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${API_TOKEN}`
                }
            })
            .then(res => res.json())
            .then(series => {
                const imagem = series.backdrop_path ? `https://image.tmdb.org/t/p/w500${series.backdrop_path}` : '../assets/images/LogoImageTestered.png'; // Placeholder caso não tenha imagem
                const imageClass = (series.backdrop_path) ? '' : 'placeholder-image'; // Aplica a classe apenas se for o placeholder
                let plataformas = series.networks.length > 0 ? series.networks[0].name : 'Indisponível';

                const card = `
                    <div class="col-lg-3 col-md-4 col-sm-6 series-favoritas">
                        <div class="card mb-3">
                            <img src="${imagem}" class="card-img-top ${imageClass}" alt="${series.name}">
                            <div class="card-body">
                                <h5 class="card-title">${series.name}</h5>
                                <p class="card-text mb-0">${series.first_air_date}</p>
                                <p class="card-text mb-2">Plataforma: ${plataformas}</p>
                                <a href="../pages/serie.html?id=${series.id}" class="btn btn-primary">Ver mais</a>
                            </div>
                        </div>
                    </div>
                `;

                if (count % tamanhoDoCarousel === 0) {
                    if (count > 0) {
                        str += `</div>`; 
                    }
                    str += `<div class="carousel-item ${i === 0 ? 'active' : ''}"><div class="row">` ;
                }

                str += card;
                count++;

                if (count % tamanhoDoCarousel === 0 || i === favoritos.length - 1) {
                    str += `</div></div>` ;
                }

                indicatorsStr += `
                    <button type="button" data-bs-target="#carouselSeriesFavoritas" data-bs-slide-to="${Math.floor(i / tamanhoDoCarousel)}" class="${i === 0 ? 'active' : ''}" aria-label="Slide ${Math.floor(i / tamanhoDoCarousel) + 1}"></button>
                `;

                const telaSeriesFavoritas = document.getElementById('telaSeriesFavoritas');
                const carouselIndicators = document.getElementById('carouselIndicators');
                
                if (telaSeriesFavoritas) {
                    telaSeriesFavoritas.innerHTML = str;
                }
                
                if (carouselIndicators) {
                    carouselIndicators.innerHTML = indicatorsStr;
                }
            })
            .catch(error => {
                console.error('Erro ao buscar os detalhes da série favorita:', error);
            });
        }

        window.addEventListener('resize', () => {
            const novoTamanhoDoCarousel = ajustarTamanhoDoCarousel();

            if (novoTamanhoDoCarousel !== tamanhoDoCarousel) {
                tamanhoDoCarousel = novoTamanhoDoCarousel;
                seriesFavoritas(); 
            }
        });
    })
    .catch(error => {
        console.error('Erro ao buscar os favoritos:', error);
    });
}
