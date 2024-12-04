document.addEventListener('DOMContentLoaded', () => {
    carouselSeries();
    novasSeries();
});

const URL = 'https://api.themoviedb.org/3/';

import API_TOKEN from '../js/config.js';

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
                str += `
                    <div class="carousel-item ${i === 0 ? 'active' : ''}">
                        <img src="https://image.tmdb.org/t/p/w1280${serie.backdrop_path}" class="d-block w-100" alt="${serie.name}">
                        <div class="carousel-caption d-none d-md-block">
                            <h5 class="carouseldesc">
                                <a href="pages/serie.html?id=${serie.id}">${serie.name}</a>
                            </h5>
                        </div>
                    </div>
                `;
            }
            document.getElementById('telaCarousel').innerHTML = str;
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
                fetch(`${URL}/tv/${serie.id}?&language=pt-BR`, {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${API_TOKEN}`
                    }
                })
                .then(res => res.json())
                .then(series => {
                let plataformas = series.networks.map(rede => rede.name).join(', ');

                str += `
                    <div class="col-lg-3 col-md-6 col-sm-6">
                        <div class="card mb-3">
                            <img src="https://image.tmdb.org/t/p/w1280${serie.backdrop_path}" class="card-img-top" alt="${serie.name}">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text mb-0">${serie.first_air_date}</p>
                                <p class="card-text mb-2">Plataformas: ${plataformas} </p> 
                                <a href="../pages/serie.html?id=${serie.id}" class="btn btn-primary">Ver mais</a>
                            </div>
                        </div>
                    </div>
                `;
            
            document.getElementById('telaNovasSeries').innerHTML = str;
            })
            }
        })
        .catch(error => {
            console.error('Erro ao buscar as séries:', error);
        });
}
