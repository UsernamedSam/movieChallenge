/* eslint-disable no-unused-vars */
//, crea una función fetchMovies() que use fetch para hacer una petición GET al endpoint de la API.
function fetchMovies(){
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=d7c445b9e058b11df66c0b72b189fc82`)
  //manejo basico de respuestas
    .then (response => response.json())
    .then(data => {
      const movies = data.results;
      renderMovies(movies);
    }) 
    .catch(error => console.error('Error fetching data:', error));
}
/*Asegúrate de usar la URL correcta para el endpoint /discover/movie.
Implementa el manejo básico de respuestas con .then() y .catch() para manejar errores.*/
const mainContainer = document.getElementById('root');
mainContainer.innerHTML = '';

function renderMovies(movies) { 
  mainContainer.innerHTML = ''; // Limpia el contenedor

  if (movies.length === 0) {
    mainContainer.innerHTML = '<p>No se encontraron películas para este género.</p>';
    return; // Sale de la función si no hay películas
  }

  const list = document.createElement('ul');
  movies.forEach(movie => {
    const movieCard = document.createElement('li');
    movieCard.classList.add('movie_card');
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      <h3>${movie.title}</h3>
      <p>${movie.release_date.split('-')[0]}</p>           
    `;

    movieCard.addEventListener('click', () => openModal(movie));

    list.appendChild(movieCard);
  });
  mainContainer.appendChild(list);
}

fetchMovies();

function openModal(movie) {
  const modal = document.getElementById('movieModal');
  const movieDetails = document.getElementById('movie-details');

  const genreNames = movie.genre_ids.map(id => genreMap[id] || 'Unknown').join(', ');

  movieDetails.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    <h2>${movie.title}</h2>
    <p><strong>Descripción:</strong> ${movie.overview}</p>
    <p><strong>Fecha de lanzamiento:</strong> ${movie.release_date}</p>
    <p><strong>Calificación:</strong> ${movie.vote_average}</p>
     <p><strong>Géneros:</strong> ${genreNames}</p>
  `;

  modal.style.display = 'block';
}

document.querySelector('.close').onclick = function() {
  document.getElementById('movieModal').style.display = 'none';
};

window.onclick = function(event) {
  const modal = document.getElementById('movieModal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

//Router
//funcion para generos
function fetchGenres(){
  fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=d7c445b9e058b11df66c0b72b189fc82`)
  //manejo basico de respuestas
    .then (response => response.json())
    .then(data => {
      const genres = data.genres;
      renderGenres(genres);
    }) 
    .catch(error => console.error('Error fetching genres', error));
}

function renderGenres(genres) { 
  const dropdownContent = document.getElementById('genresDropdown');
  dropdownContent.innerHTML = '';

  genres.forEach(genre => {
    const genreLink = document.createElement('a');
    genreLink.href = `#genre-${genre.id}`;
    genreLink.textContent = genre.name;

    genreLink.addEventListener('click', () => {
      fetchMoviesByGenre(genre.id);
    });

    dropdownContent.appendChild(genreLink);
  });

  const dropdown = document.querySelector('.dropdown');
  dropdown.addEventListener('mouseover', () => {
    dropdownContent.style.display = 'block';
  });

  dropdown.addEventListener('mouseout', () => {
    dropdownContent.style.display = 'none';
  });

  dropdown.addEventListener('change', (event) => {
    const selectedGenreId = event.target.value;
    console.log('Selected Genre ID:', selectedGenreId);
    fetchMoviesByGenre(selectedGenreId);
  });
}

function fetchMoviesByGenre(genreId) {
  fetch(`https://api.themoviedb.org/3/discover/movie?api_key=d7c445b9e058b11df66c0b72b189fc82&with_genres=${genreId}`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      const movies = data.results;
      renderMovies(movies);
    })
    .catch(error => console.error('Error fetching movies by genre', error));
}

function fetchTopRatedMovies(){
  fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=d7c445b9e058b11df66c0b72b189fc82`)
  //manejo basico de respuestas
    .then (response => response.json())
    .then(data => {
      console.log(data);
      const movies = data.results;
      renderMovies(movies);
    }) 
    .catch(error => console.error('Error fetching top rated movies', error));
}

function fetchUpcomingMovies(){
  fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=d7c445b9e058b11df66c0b72b189fc82`)
  //manejo basico de respuestas
    .then (response => response.json())
    .then(data => {
      console.log(data);
      const movies = data.results;
      renderMovies(movies);
    }) 
    .catch(error => console.error('Error fetching upcoming movies', error));
}


//hashchange
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('load', handleHashChange);

function handleHashChange() {
  const hash = window.location.hash.substring(1); //quita el # 
  
  const content = document.getElementById('content');
  content.innerHTML = '';

  if (hash === 'movies') {
    fetchMovies();
  } else if (hash === 'genres') {
    fetchGenres();
  } else if (hash === 'top-rated') {
    fetchTopRatedMovies();
  } else if (hash === 'upcoming') {
    fetchUpcomingMovies();
  } else {
    fetchMovies();
  }
}
//search btn
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-input');

function searchMovies() {
  const query = document.getElementById('search-input').value.trim();

  if (query) {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=d7c445b9e058b11df66c0b72b189fc82&query=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => {
        const movies = data.results;
        if (movies.length > 0) {
          renderMovies(movies);
        } else {
          mainContainer.innerHTML = '<p>No movies found.</p>';
        }
      })
      .catch(error => console.error('Error fetching search results:', error));
  }
}
searchButton.addEventListener('click', () => {
  const query = searchInput.value;
  if (query) {
    searchMovies(query);
  }
});

//NavBar

function openNav() {
  document.getElementById("sidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
  document.getElementById("sidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}

const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};
