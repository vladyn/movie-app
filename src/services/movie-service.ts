// This file contains the functions to fetch data from the OMDB API.
// the result to display will be only the IT Crowd movie series.
//https://www.omdbapi.com/?t=it%20crowd&season=1&apikey=d425abd7

const API_KEY = 'd425abd7';
const BASE_URL = 'https://www.omdbapi.com/';

export type Episode = {
    Title: string;
    Released: string;
    Episode: string;
    imdbRating: string;
    imdbID: string;
    Poster: string;
};

export type SeasonResponse = {
    Title: string;
    Season: string;
    totalSeasons: string;
    Episodes: Episode[];
    Response: 'True';
};

export type MovieResponse = {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: { Source: string; Value: string }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: 'series';
    totalSeasons: string;
    Response: 'True';
};

export type Movie = {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Season: string;
    Episode: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string;
    Ratings: { Source: string; Value: string }[];
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    seriesID: string;
    Type: 'episode';
    Response: 'True';
};

export const searchMovies = async (title: string): Promise<MovieResponse> => {
    const response = await fetch(`${BASE_URL}?t=${title}&apikey=${API_KEY}`);
    if(!response.ok) {
        throw new Error('Failed to fetch movie data');
    }
    return await response.json();
}

export const searchEpisodes = async (title: string): Promise<SeasonResponse> => {
    const response = await fetch(`${BASE_URL}?t=${title}&season=1&apikey=${API_KEY}`);
    if(!response.ok) {
        throw new Error('Failed to fetch season data');
    }
    return await response.json();
}

export const getEpisodeDetails = async (imdbID: string): Promise<Movie> => {
    const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
    if(!response.ok) {
        throw new Error('Failed to fetch episode details');
    }
    return await response.json();
}
