import {
  getEpisodeDetails,
  searchEpisodes,
  searchMovies,
  type Episode,
  type MovieResponse,
  type SeasonResponse,
} from '../src/services/movie-service';

const episode: Episode = {
  Title: 'Yesterday\'s Jam',
  Released: '2006-02-03',
  Episode: '1',
  imdbRating: '8.2',
  imdbID: 'tt0609857',
  Poster: 'https://example.com/episode.jpg',
};

const season: SeasonResponse = {
  Title: 'The IT Crowd',
  Season: '1',
  totalSeasons: '4',
  Episodes: [episode],
};

const movie: MovieResponse = {
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
  expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(
    /^https:\/\/www\.omdbapi\.com\/\?t=it crowd&apikey=.+$/,
  ));
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
  expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(
    /^https:\/\/www\.omdbapi\.com\/\?t=it crowd&season=1&apikey=.+$/,
  ));
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

  await expect(getEpisodeDetails('tt0609857')).resolves.toEqual(episode);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(
    /^https:\/\/www\.omdbapi\.com\/\?i=tt0609857&apikey=.+$/,
  ));
  expect(json).toHaveBeenCalledTimes(1);
});

test('getEpisodeDetails rejects an unsuccessful response without reading JSON', async () => {
  const json = jest.fn();
  fetchMock.mockResolvedValue({ ok: false, json });

  await expect(getEpisodeDetails('tt0609857')).rejects.toThrow('Failed to fetch episode details');
  expect(json).not.toHaveBeenCalled();
});
