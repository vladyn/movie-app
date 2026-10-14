import { getEpisodeDetails, searchMovies, type Episode, type SeasonResponse } from '../src/services/movie-service';

const episode: Episode = {
  Title: 'Yesterday\'s Jam',
  Released: '2006-02-03',
  Episode: '1',
  imdbRating: '8.2',
  imdbID: 'tt0609857',
};

const season: SeasonResponse = {
  Title: 'The IT Crowd',
  Season: '1',
  totalSeasons: '4',
  Episodes: [episode],
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

test('searchMovies fetches the first season and returns its episodes', async () => {
  const json = jest.fn().mockResolvedValue(season);
  fetchMock.mockResolvedValue({ ok: true, json });

  await expect(searchMovies('it crowd')).resolves.toEqual(season);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(
    /^https:\/\/www\.omdbapi\.com\/\?t=it crowd&season=1&apikey=.+$/,
  ));
  expect(json).toHaveBeenCalledTimes(1);
});

test('searchMovies rejects an unsuccessful HTTP response without reading JSON', async () => {
  const json = jest.fn();
  fetchMock.mockResolvedValue({ ok: false, json });

  await expect(searchMovies('it crowd')).rejects.toThrow('Failed to fetch season data');
  expect(json).not.toHaveBeenCalled();
});

test('getEpisodeDetails fetches an episode by IMDb ID and returns its details', async () => {
  const json = jest.fn().mockResolvedValue(episode);
  fetchMock.mockResolvedValue({ ok: true, json });

  await expect(getEpisodeDetails('tt0609857')).resolves.toEqual(episode);
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(fetchMock).toHaveBeenCalledWith(expect.stringMatching(
    /^https:\/\/www\.omdbapi\.com\/\?i=tt0609857&apikey=.+$/,
  ));
  expect(json).toHaveBeenCalledTimes(1);
});

test('getEpisodeDetails rejects an unsuccessful HTTP response without reading JSON', async () => {
  const json = jest.fn();
  fetchMock.mockResolvedValue({ ok: false, json });

  await expect(getEpisodeDetails('tt0609857')).rejects.toThrow('Failed to fetch episode details');
  expect(json).not.toHaveBeenCalled();
});
