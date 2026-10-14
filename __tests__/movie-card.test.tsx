import { render, screen } from '@testing-library/react-native';

import { MovieCard } from '../src/components/movie-card';
import type { Episode } from '../src/services/movie-service';

test('shows an episode title, poster, number, release date, and rating', async () => {
  const episode: Episode = {
    Title: 'Yesterday\'s Jam',
    Released: '2006-02-03',
    Episode: '1',
    imdbRating: '8.2',
    imdbID: 'tt0609857',
    Poster: 'https://example.com/episode.jpg',
  };

  await render(<MovieCard episode={episode} />);

  expect(screen.getByText('Yesterday\'s Jam')).toBeTruthy();
  expect(screen.getByText('Episode 1')).toBeTruthy();
  expect(screen.getByText('Released: 2006-02-03')).toBeTruthy();
  expect(screen.getByText('IMDb rating: 8.2')).toBeTruthy();
  expect(screen.getByLabelText('Yesterday\'s Jam poster').props.source).toEqual({
    uri: 'https://example.com/episode.jpg',
  });
});
