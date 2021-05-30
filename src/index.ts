import './styles.scss';
import Movies from './Movies';

// Initialises Movies API
const movies: Movies = new Movies();

// Remember references to the DOM elements used later
const resultsContainer = document.getElementById('search-results');
const detailsContainer = document.getElementById('movie-details');
const errorContainer = document.getElementById('error');

// Add listener to search button
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
//searchInput.addEventListener('keyup', () => console.log('bla'));
searchInput.addEventListener('keyup', () => {
    delayTimer((searchInput as HTMLInputElement).value, (yearInput as HTMLInputElement).value);
    //updateSearchResults((searchInput as HTMLInputElement).value, (yearInput as HTMLInputElement).value);
});
const yearInput = document.getElementById('year-input');
searchButton.addEventListener('click', () => {
    updateSearchResults((searchInput as HTMLInputElement).value, (yearInput as HTMLInputElement).value);
});

// Display error message to user
const displayError = (message: string) => {
    errorContainer.innerHTML = `<div>Error: ${message}</div>`;
};

// Load new search results and update the listing
const updateSearchResults = async (keyword: string, year: string) => {
    console.log('he')
    let results = [];
    if (localStorage.getItem(keyword + year)) {
        results = JSON.parse(localStorage.getItem(keyword));
    } else {
        try {
            results = await movies.search(keyword, year);
            localStorage.setItem(keyword+year, JSON.stringify(results))
        } catch (error) {
            displayError(error);
        }
    }
    resultsContainer.innerHTML = '';
    results.sort((a,b)=>a.Title.localeCompare(b.Title))
    // Add movie results one-by-one to the list
    results.forEach((movie) => {
        const movieContainer: HTMLElement = document.createElement('div');
        movieContainer.innerHTML = movie.Title;
        movieContainer.addEventListener('click', updateMovieDetails.bind(this, movie.Title, movie.Poster, uniqueWordCount(movie.Title)));
        resultsContainer.appendChild(movieContainer);
    });
};

// Load detailed information about a movie by its IMDB ID
const updateMovieDetails = async (movieTitle: string, movieImg: string, count: number) => {
    //detailsContainer.innerHTML = `<div>Movie IMDB ID: ${movieId}</div>`;
    detailsContainer.innerHTML = `<h2>${movieTitle}</h2>
                                    <img src=${movieImg} alt=${count}></img>`;

    // Make an API request and return movie information.
    // E.g: http://www.omdbapi.com/?i=tt0465494&apikey=86e1fde4
};

let timer;
const delayTimer = async (keyword: string, year: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        updateSearchResults((searchInput as HTMLInputElement).value, (yearInput as HTMLInputElement).value);
    }, 300);
};

function uniqueWordCount(str: string) { 
    let set = new Set(str.split(' '));
    return set.size;
  }

