import API_TOKEN from '../js/config.js';

document.addEventListener('DOMContentLoaded', () => {
    carregarSeries();
});

const URL = 'https://api.themoviedb.org/3/';

function carregarSeries() {
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

        for (let i = 0; i < data.results.length; i++) {
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
                    <div class="col-lg-4 col-md-6 col-sm-6">
                        <div class="card mb-3">
                            <img src="https://image.tmdb.org/t/p/w500${serie.backdrop_path}" class="card-img-top" alt="${serie.name}">
                            <div class="card-body">
                                <h5 class="card-title">${serie.name}</h5>
                                <p class="card-text mb-0">${serie.first_air_date}</p>
                                <p class="card-text mb-2">Plataformas: ${plataformas} </p> 
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
