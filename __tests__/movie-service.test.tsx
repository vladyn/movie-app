import {
  getEpisodeDetails,
  searchEpisodes,
  searchMovies,
  type Episode,
  type MovieResponse,
  type SeasonResponse,
  type SeriesResponse,
} from '../src/services/movie-service';

const episode: MovieResponse = {
  Title: 'Fifty-Fifty',
  Year: '2006',
  Rated: 'TV-14',
  Released: '10 Feb 2006',
  Season: '1',
  Episode: '3',
  Runtime: '25 min',
  Genre: 'Comedy',
  Director: 'Graham Linehan',
  Writer: 'Graham Linehan',
  Actors: "Chris O'Dowd, Richard Ayoade, Katherine Parkinson",
  Plot: 'When Roy gets dumped after a date, he starts believing that girls go for "bad boys" and creates a fake profile on a dating site and, surprisingly, gets a response. Meanwhile, Jen starts flirting with a security guard.',
  Language: 'English',
  Country: 'United Kingdom',
  Awards: 'N/A',
  Poster: 'https://m.media-amazon.com/images/M/MV5BNDNhNThlNGItOTNlYi00YWU3LWEwYWUtNDIwZjA4MGQ5ZGQ3XkEyXkFqcGc@._V1_SX300.jpg',
  Ratings: [{ Source: 'Internet Movie Database', Value: '7.7/10' }],
  Metascore: 'N/A',
  imdbRating: '7.7',
  imdbVotes: '2724',
  imdbID: 'tt0609849',
  seriesID: 'tt0487831',
  Type: 'episode',
  Response: 'True',
};

const seasonEpisode: Episode = {
  Title: episode.Title,
  Released: episode.Released,
  Episode: episode.Episode,
  imdbRating: episode.imdbRating,
  imdbID: episode.imdbID,
};

const season: SeasonResponse = {
  Title: 'The IT Crowd',
  Season: '1',
  totalSeasons: '4',
  Episodes: [seasonEpisode],
};

const movie: SeriesResponse = {
  Title: 'The IT Crowd',
  Year: '2006–2013',
  Rated: 'TV-14',
  Released: '2006-02-03',
  Runtime: '25 min',
  Genre: 'Comedy',
  Director: 'N/A',
  Writer: 'Graham Linehan',
  Actors: 'Chris O\'Dowd, Richard Ayoade',
  Plot: 'The adventures of an IT department.',
  Language: 'English',
  Country: 'United Kingdom',
  Awards: 'N/A',
  Poster: 'https://example.com/series.jpg',
  Ratings: [{ Source: 'Internet Movie Database', Value: '8.5/10' }],
  Metascore: 'N/A',
  imdbRating: '8.5',
  imdbVotes: '150,000',
  imdbID: 'tt0487831',
  Type: 'series',
  totalSeasons: '4',
  Response: 'True',
};

const originalFetch = globalThis.fetch;
const fetchMock = jest.fn();

beforeEach(() => {
  globalThis.fetch = fetchMock as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  fetchMock.mockReset();
});

test('searchMovies fetches series details', async () => {
  const json = jest.fn().mockResolvedValue(movie);
  fetchMock.mockResolvedValue({ ok: true, json });

  await expect(searchMovies('it crowd')).resolves.toEqual(movie);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith('https://www.omdbapi.com/?t=it crowd&apikey=test-api-key');
  expect(json).toHaveBeenCalledTimes(1);
});

test('searchMovies rejects an unsuccessful response without reading JSON', async () => {
  const json = jest.fn();
  fetchMock.mockResolvedValue({ ok: false, json });

  await expect(searchMovies('it crowd')).rejects.toThrow('Failed to fetch movie data');
  expect(json).not.toHaveBeenCalled();
});

test('searchEpisodes fetches the first season', async () => {
  const json = jest.fn().mockResolvedValue(season);
  fetchMock.mockResolvedValue({ ok: true, json });

  await expect(searchEpisodes('it crowd')).resolves.toEqual(season);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith('https://www.omdbapi.com/?t=it crowd&season=1&apikey=test-api-key');
  expect(json).toHaveBeenCalledTimes(1);
});

test('searchEpisodes rejects an unsuccessful response without reading JSON', async () => {
  const json = jest.fn();
  fetchMock.mockResolvedValue({ ok: false, json });

  await expect(searchEpisodes('it crowd')).rejects.toThrow('Failed to fetch season data');
  expect(json).not.toHaveBeenCalled();
});

test('getEpisodeDetails fetches an episode by IMDb ID', async () => {
  const json = jest.fn().mockResolvedValue(episode);
  fetchMock.mockResolvedValue({ ok: true, json });

  await expect(getEpisodeDetails('tt0609849')).resolves.toEqual(episode);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith('https://www.omdbapi.com/?i=tt0609849&apikey=test-api-key');
  expect(json).toHaveBeenCalledTimes(1);
});

test('getEpisodeDetails rejects an unsuccessful response without reading JSON', async () => {
  const json = jest.fn();
  fetchMock.mockResolvedValue({ ok: false, json });

  await expect(getEpisodeDetails('tt0609849')).rejects.toThrow('Failed to fetch episode details');
  expect(json).not.toHaveBeenCalled();
});
