import API_TOKEN from '../js/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const parametros = new URLSearchParams(window.location.search);
    const idSerie = parametros.get('id');
    if (idSerie) {
        carregarDadosSerie(idSerie);
    } else {
        console.error('ID da série não encontrado');
    }
    
    // Inicializando o botão favoritar/desfavoritar
    const btnFavoritar = document.getElementById('btnFavoritarSerie');
    btnFavoritar.addEventListener('click', () => {
        const plataforma = document.getElementById('plataforma').textContent.replace('Plataforma: ', '');
        if (btnFavoritar.textContent === '♥ Favoritar') {
            favoritarSerie(idSerie, plataforma, btnFavoritar);
        } else {
            desfavoritarSerie(idSerie, btnFavoritar);
        }
    });
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
    .then(res => res.json())
    .then(dados => {
        console.log(dados); 
        let plataforma = dados.networks.map(rede => rede.name).join(', ');

        document.getElementById('nomeSerie').innerText = dados.name;
        document.getElementById('imagemSerie').src = `https://image.tmdb.org/t/p/w500${dados.poster_path}`;
        document.getElementById('genero').innerHTML = `<span class="destaque">Gênero:</span> ${dados.genres.map(genero => genero.name).join(', ')}`;
        document.getElementById('dataLancamento').innerHTML = `<span class="destaque">Data de Lançamento:</span> ${dados.first_air_date}`;
        document.getElementById('sinopse').innerHTML = `<span class="destaque">Sinopse:</span> ${dados.overview}`;
        document.getElementById('plataforma').innerHTML = `<span class="destaque">Plataforma:</span> ${plataforma}`;
        document.getElementById('temporadas').innerHTML = `<span class="destaque">Temporadas:</span> ${dados.number_of_seasons}`;

        carregarElenco(id);
        verificarFavorito(dados.id); 
    })
    .catch(erro => {
        console.error('Erro ao buscar os dados da série:', erro);
    });
}

function verificarFavorito(id) {
    fetch('/favoritos')
        .then(res => res.json())
        .then(favoritos => {
            const btnFavoritar = document.getElementById('btnFavoritarSerie');
            
            const jaFavoritado = favoritos.some(favorito => String(favorito.idSerie) === String(id));

            if (jaFavoritado) {
                btnFavoritar.textContent = 'Remover favorito';
            } else {
                btnFavoritar.textContent = '♥ Favoritar';
            }
        })
        .catch(erro => console.error('Erro ao verificar favoritos:', erro));
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
    .then(res => res.json())
    .then(data => {
        console.log(data); 
        const atores = data.cast;

        function ajustarTamanhoDoCarousel() {
            const larguraTela = window.innerWidth;
            if (larguraTela < 768) {
                return 1; 
            } else if (larguraTela < 992) {
                return 2;
            } else {
                return 4;
            }
        }

        let tamanhoDoCarousel = ajustarTamanhoDoCarousel();

        function criarCarrossel() {
            let contadorDeSlides = 0;
            let htmlConteudo = '';

            for (let i = 0; i < atores.length; i += tamanhoDoCarousel) {
                let htmlDoSlide = `<div class="carousel-item ${contadorDeSlides === 0 ? 'active' : ''}">`;
                contadorDeSlides++;

                htmlDoSlide += `<div class="row text-center">`;
                for (let j = i; j < i + tamanhoDoCarousel && j < atores.length; j++) {
                    const ator = atores[j];
                    htmlDoSlide += `
                        <div class=" col-md-6 col-lg-3 mb-4 card-elenco">
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
                htmlConteudo += htmlDoSlide;
            }

            // Atualizando o conteúdo do carrossel
            document.getElementById('carouselActors').innerHTML = htmlConteudo;
        }

        // Cria o carrossel inicialmente
        criarCarrossel();

        // Atualiza o carrossel sempre que a tela for redimensionada
        window.addEventListener('resize', () => {
            const novoTamanhoDoCarousel = ajustarTamanhoDoCarousel();

            // Se o tamanho mudou, recalcula o carrossel
            if (novoTamanhoDoCarousel !== tamanhoDoCarousel) {
                tamanhoDoCarousel = novoTamanhoDoCarousel;
                criarCarrossel();
            }
        });

    })
    .catch(erro => {
        console.error('Erro ao buscar o elenco da série:', erro);
    });
}

function favoritarSerie(id, plataforma, btnFavoritar) {
    const URL = `https://api.themoviedb.org/3/tv/${id}?&language=pt-BR`;

    fetch(URL, {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_TOKEN}`
        }
    })
    .then(res => res.json())
    .then(series => {
        const novoFavorito = {
            idSerie: series.id,
            nomeSerie: series.name,
            dataSerie: series.first_air_date,
            seriePlataforma: plataforma,
        };

        fetch('/favoritos')
            .then(res => res.json())
            .then(favoritos => {
                let jaFavoritado = favoritos.some(favorito => favorito.nomeSerie === novoFavorito.nomeSerie);

                if (jaFavoritado) {
                    alert('Essa série já está nos seus favoritos!');
                } else {
                    fetch('/favoritos', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(novoFavorito),
                    })
                    .then(res => {
                        if (res.ok) {
                            console.log('Série favoritada com sucesso!');
                            btnFavoritar.textContent = 'Remover favorito';
                        } else {
                            console.error('Erro ao favoritar a série:', res.statusText);
                        }
                    })
                    .catch(erro => console.error('Erro ao processar os dados da série:', erro));
                }
            })
            .catch(erro => console.error('Erro ao verificar favoritos:', erro));
    })
    .catch(erro => console.error('Erro ao buscar os dados da série:', erro));
}

function desfavoritarSerie(id, btnFavoritar) {
    fetch('/favoritos') 
        .then(res => res.json())
        .then(favoritos => {
            let favoritoEncontrado = null;

            for (let i = 0; i < favoritos.length; i++) {
                if (Number(favoritos[i].idSerie) === Number(id)) {
                    favoritoEncontrado = favoritos[i];
                    break;
                }
            }

            if (favoritoEncontrado) {
                fetch(`/favoritos/${favoritoEncontrado.id}`, {
                    method: 'DELETE',
                })
                .then(res => {
                    if (res.ok) {
                        console.log('Série desfavoritada com sucesso!');
                        btnFavoritar.textContent = '♥ Favoritar';  
                    } else {
                        console.error('Erro ao desfavoritar a série:', res.statusText);
                    }
                })
                .catch(erro => console.error('Erro ao desfavoritar a série:', erro));
            } else {
                console.error('Favorito não encontrado.');
            }
        })
        .catch(erro => console.error('Erro ao verificar favoritos:', erro));
}
