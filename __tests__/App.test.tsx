import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import App from '../App';
import { searchEpisodes, searchMovies, type Episode, type MovieResponse, type SeasonResponse } from '../src/services/movie-service';

jest.mock('../src/services/movie-service', () => ({
  searchMovies: jest.fn(),
  searchEpisodes: jest.fn(),
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

const movie = {
  Title: 'The IT Crowd',
  Year: '2006–2013',
  imdbID: 'tt0487831',
  Poster: 'https://example.com/series.jpg',
  imdbRating: '8.5',
} as MovieResponse;

const searchMoviesMock = searchMovies as jest.MockedFunction<typeof searchMovies>;
const searchEpisodesMock = searchEpisodes as jest.MockedFunction<typeof searchEpisodes>;

beforeEach(() => {
  searchMoviesMock.mockReset();
  searchEpisodesMock.mockReset();
});

test('loads and displays episode fields from the season service', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockResolvedValue(season);
  await render(<App />);

  expect(searchMoviesMock).toHaveBeenCalledWith('it crowd');
  expect(searchEpisodesMock).toHaveBeenCalledWith('it crowd');
  await waitFor(() => expect(screen.getByText('Yesterday\'s Jam')).toBeTruthy());
  expect(screen.getByText('Calamity Jen')).toBeTruthy();
  expect(screen.getByText('Episode 1')).toBeTruthy();
  expect(screen.getByText('Released: 2006-02-03')).toBeTruthy();
  expect(screen.getByText('IMDb rating: 8.2')).toBeTruthy();
  expect(screen.getByTestId('movie-list').props.data).toEqual(episodes);
});

test('shows loading while the season request is pending', async () => {
  searchMoviesMock.mockImplementation(() => new Promise(() => {}));
  searchEpisodesMock.mockImplementation(() => new Promise(() => {}));
  await render(<App />);

  expect(screen.getByText('Loading episodes...')).toBeTruthy();
});

test('shows an error when the season request fails', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockRejectedValue(new Error('Network unavailable'));
  await render(<App />);

  await waitFor(() => expect(screen.getByText('Could not load episodes.')).toBeTruthy());
});

test('shows an empty message when the season has no episodes', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockResolvedValue({ ...season, Episodes: [] });
  await render(<App />);

  await waitFor(() => expect(screen.getByText('No episodes found.')).toBeTruthy());
});

test('switches the episode list between vertical and horizontal layouts', async () => {
  searchMoviesMock.mockResolvedValue(movie);
  searchEpisodesMock.mockResolvedValue(season);
  await render(<App />);
  await waitFor(() => expect(screen.getByText('Yesterday\'s Jam')).toBeTruthy());

  expect(screen.getByTestId('movie-list').props.horizontal).toBe(false);
  await fireEvent(screen.getByRole('switch', { name: 'Horizontal' }), 'valueChange', true);
  expect(screen.getByTestId('movie-list').props.horizontal).toBe(true);
  await fireEvent(screen.getByRole('switch', { name: 'Horizontal' }), 'valueChange', false);
  expect(screen.getByTestId('movie-list').props.horizontal).toBe(false);
});
