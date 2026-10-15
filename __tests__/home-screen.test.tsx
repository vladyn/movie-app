import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { HomeScreen } from '../src/components/home-screen';
import { getEpisodeDetails, searchEpisodes, searchMovies, type Episode, type MovieResponse, type SeasonResponse, type SeriesResponse } from '../src/services/movie-service';

const mockNavigate = jest.fn();

jest.mock('../src/services/movie-service', () => ({
  searchMovies: jest.fn(),
  searchEpisodes: jest.fn(),
  getEpisodeDetails: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: mockNavigate }),
}));

const episodes: Episode[] = [
  {
    Title: 'Yesterday\'s Jam',
    Released: '2006-02-03',
    Episode: '1',
    imdbRating: '8.2',
    imdbID: 'tt0609857',
    Poster: 'https://example.com/episode-1.jpg',
  },
  {
    Title: 'Calamity Jen',
    Released: '2006-02-10',
    Episode: '2',
    imdbRating: '8.1',
    imdbID: 'tt0609856',
    Poster: 'https://example.com/episode-2.jpg',
  },
];

const season: SeasonResponse = {
  Title: 'The IT Crowd',
  Season: '1',
  totalSeasons: '4',
  Episodes: episodes,
};

const detailBase: MovieResponse = {
  Title: 'Yesterday\'s Jam',
  Year: '2006',
  Rated: 'TV-14',
  Released: '2006-02-03',
  Season: '1',
  Episode: '1',
  Runtime: '25 min',
  Genre: 'Comedy',
  Director: 'Graham Linehan',
  Writer: 'Graham Linehan',
  Actors: "Chris O'Dowd, Richard Ayoade, Katherine Parkinson",
  Plot: 'Episode plot',
  Language: 'English',
  Country: 'United Kingdom',
  Awards: 'N/A',
  Poster: 'https://example.com/episode-1.jpg',
  Ratings: [{ Source: 'Internet Movie Database', Value: '8.2/10' }],
  Metascore: 'N/A',
  imdbRating: '8.2',
  imdbVotes: '2724',
  imdbID: 'tt0609857',
  seriesID: 'tt0487831',
  Type: 'episode',
  Response: 'True',
};

const episodeDetails: MovieResponse[] = episodes.map((episode) => ({
  ...detailBase,
  ...episode,
}));

const movie = {
  Title: 'The IT Crowd',
  Year: '2006–2013',
  imdbID: 'tt0487831',
  Poster: 'https://example.com/series.jpg',
  imdbRating: '8.5',
} as SeriesResponse;

const searchMoviesMock = searchMovies as jest.MockedFunction<typeof searchMovies>;
const searchEpisodesMock = searchEpisodes as jest.MockedFunction<typeof searchEpisodes>;
const getEpisodeDetailsMock = getEpisodeDetails as jest.MockedFunction<typeof getEpisodeDetails>;

beforeEach(() => {
  mockNavigate.mockReset();
  searchMoviesMock.mockReset();
  searchEpisodesMock.mockReset();
  getEpisodeDetailsMock.mockReset();
  getEpisodeDetailsMock.mockImplementation(async (imdbID) => episodeDetails.find((episode) => episode.imdbID === imdbID)!);
});

test('loads and displays episode fields from the season service', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockResolvedValue(season);
  await render(<HomeScreen />);

  expect(searchMoviesMock).toHaveBeenCalledWith('it crowd');
  expect(searchEpisodesMock).toHaveBeenCalledWith('it crowd');
  expect(getEpisodeDetailsMock).toHaveBeenCalledTimes(2);
  await waitFor(() => expect(screen.getByText('Yesterday\'s Jam')).toBeTruthy());
  expect(screen.getByText('Calamity Jen')).toBeTruthy();
  expect(screen.getAllByText('Season 1')).toHaveLength(2);
  expect(screen.getByText('Released: 2006-02-03')).toBeTruthy();
  expect(screen.getAllByText('Genre: Comedy')).toHaveLength(2);
  expect(screen.getAllByText('Country: United Kingdom')).toHaveLength(2);
  expect(screen.getByTestId('movie-list').props.data).toEqual(episodeDetails);

  fireEvent.press(screen.getByRole('button', { name: /Yesterday's Jam/ }));
  expect(mockNavigate).toHaveBeenCalledWith('Episode', { episode: episodeDetails[0] });
});

test('uses episode details for poster, genre, and country', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockResolvedValue(season);
  getEpisodeDetailsMock.mockImplementation(async (imdbID) => ({
    ...episodeDetails.find((episode) => episode.imdbID === imdbID)!,
    Poster: `https://example.com/${imdbID}.jpg`,
    Genre: 'Science Fiction',
    Country: 'Ireland',
  }));

  await render(<HomeScreen />);

  await waitFor(() => expect(screen.getAllByText('Genre: Science Fiction')).toHaveLength(2));
  expect(screen.getAllByText('Country: Ireland')).toHaveLength(2);
  expect(screen.getByLabelText('Yesterday\'s Jam poster').props.source).toEqual({
    uri: 'https://example.com/tt0609857.jpg',
  });
});

test('keeps season data when one episode detail request fails', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockResolvedValue(season);
  getEpisodeDetailsMock.mockImplementation(async (imdbID) => {
    if (imdbID === 'tt0609857') throw new Error('Details unavailable');
    return episodeDetails[1];
  });

  await render(<HomeScreen />);

  await waitFor(() => expect(screen.getByText('Yesterday\'s Jam')).toBeTruthy());
  expect(screen.getByText('Genre: Comedy')).toBeTruthy();
  expect(screen.getByTestId('movie-list').props.data).toEqual([
    { ...episodes[0], Season: '1' },
    episodeDetails[1],
  ]);
});

test('shows loading while the season request is pending', async () => {
  searchMoviesMock.mockImplementation(() => new Promise(() => {}));
  searchEpisodesMock.mockImplementation(() => new Promise(() => {}));
  await render(<HomeScreen />);

  expect(screen.getByText('Loading episodes...')).toBeTruthy();
});

test('shows an error when the season request fails', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockRejectedValue(new Error('Network unavailable'));
  await render(<HomeScreen />);

  await waitFor(() => expect(screen.getByText('Could not load episodes.')).toBeTruthy());
});

test('shows an empty message when the season has no episodes', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockResolvedValue({ ...season, Episodes: [] });
  await render(<HomeScreen />);

  await waitFor(() => expect(screen.getByText('No episodes found.')).toBeTruthy());
});

test('switches the episode list between vertical and horizontal layouts', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockResolvedValue(season);
  await render(<HomeScreen />);
  await waitFor(() => expect(screen.getByText('Yesterday\'s Jam')).toBeTruthy());

  expect(screen.getByTestId('movie-list').props.horizontal).toBe(false);
  await fireEvent(screen.getByRole('switch', { name: 'Horizontal' }), 'valueChange', true);
  expect(screen.getByTestId('movie-list').props.horizontal).toBe(true);
  await fireEvent(screen.getByRole('switch', { name: 'Horizontal' }), 'valueChange', false);
  expect(screen.getByTestId('movie-list').props.horizontal).toBe(false);
});

test('ignores a completed season request after unmounting', async () => {
  let resolveSeason!: (season: SeasonResponse) => void;
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockImplementation(() => new Promise((resolve) => {
    resolveSeason = resolve;
  }));

  const { unmount } = await render(<HomeScreen />);
  await waitFor(() => expect(searchEpisodesMock).toHaveBeenCalledTimes(1));
  await unmount();
  await act(async () => { resolveSeason(season); });

  expect(getEpisodeDetailsMock).toHaveBeenCalledTimes(2);
});

test('ignores a failed season request after unmounting', async () => {
  let rejectSeason!: (error: Error) => void;
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockImplementation(() => new Promise((_, reject) => {
    rejectSeason = reject;
  }));

  const { unmount } = await render(<HomeScreen />);
  await waitFor(() => expect(searchEpisodesMock).toHaveBeenCalledTimes(1));
  await unmount();
  await act(async () => { rejectSeason(new Error('Network unavailable')); });

  expect(getEpisodeDetailsMock).not.toHaveBeenCalled();
});
