import { fireEvent, render, screen } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';

import { MovieCard } from '../src/components/movie-card';
import type { Episode } from '../src/services/movie-service';

test('shows an episode title, poster, number, release date, and rating', async () => {
  const onPress = jest.fn();
  const episode: Episode = {
    Title: 'Yesterday\'s Jam',
    Released: '2006-02-03',
    Episode: '1',
    imdbRating: '8.2',
    imdbID: 'tt0609857',
    Poster: 'https://example.com/episode.jpg',
    Season: '1',
  };

  await render(<MovieCard episode={episode} onPress={onPress} />);

  expect(screen.getByText('Yesterday\'s Jam')).toBeTruthy();
  expect(screen.getByText('Season 1')).toBeTruthy();
  expect(screen.getByText('Released: 2006-02-03')).toBeTruthy();
  expect(screen.getByText('IMDb rating: 8.2')).toBeTruthy();
  expect(screen.queryByText('Episode Details:')).toBeNull();
  expect(screen.queryByText('IMDb ID: tt0609857')).toBeNull();
  expect(screen.getByLabelText('Yesterday\'s Jam poster').props.source).toEqual({
    uri: 'https://example.com/episode.jpg',
  });

  fireEvent.press(screen.getByRole('button'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('accepts a card width and height', async () => {
  const episode: Episode = {
    Title: 'Yesterday\'s Jam',
    Released: '2006-02-03',
    Episode: '1',
    imdbRating: '8.2',
    imdbID: 'tt0609857',
    Poster: 'https://example.com/episode.jpg',
    Season: '1',
  };

  await render(<MovieCard episode={episode} width={320} height={520} />);

  expect(StyleSheet.flatten(screen.getByText('Yesterday\'s Jam').parent?.props.style).width).toBe(320);
  expect(StyleSheet.flatten(screen.getByText('Yesterday\'s Jam').parent?.props.style).height).toBe(520);
});
