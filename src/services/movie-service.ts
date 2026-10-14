const API_KEY = 'd425abd7';
const BASE_URL = 'https://www.omdbapi.com/';

export type SeasonResponse = {
    Title: string;
    Season: string;
    totalSeasons: string;
    Episodes: Episode[];
};

type TitleDetails = {
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
};

export type MovieResponse = TitleDetails & {
    Season: string;
    Episode: string;
    seriesID: string;
    Type: 'episode';
    Response: 'True';
};

export type SeriesResponse = TitleDetails & {
    Type: 'series';
    totalSeasons: string;
    Response: 'True';
};

export type Episode = Pick<MovieResponse, 'Title' | 'Released' | 'Episode' | 'imdbRating' | 'imdbID'> &
    Partial<Pick<MovieResponse, 'Poster' | 'Season' | 'Director' | 'Writer' | 'Actors' | 'Plot'>>;

export const searchMovies = async (title: string): Promise<SeriesResponse> => {
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

export const getEpisodeDetails = async (imdbID: string): Promise<MovieResponse> => {
    const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
    if(!response.ok) {
        throw new Error('Failed to fetch episode details');
    }
    return await response.json();
}
