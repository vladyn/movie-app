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
  expect(screen.queryByText('Episode Details:')).toBeNull();
  expect(screen.queryByLabelText('IMDb rating 8.2 out of 10')).toBeNull();
  expect(screen.queryByText('IMDb ID: tt0609857')).toBeNull();
  expect(screen.getByLabelText('Yesterday\'s Jam poster').props.source).toEqual({
    uri: 'https://example.com/episode.jpg',
  });

  fireEvent.press(screen.getByRole('button'));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test('shows a star rating and grouped metadata for episode details', async () => {
  const episode: Episode = {
    Title: 'Yesterday\'s Jam',
    Released: '2006-02-03',
    Episode: '1',
    imdbRating: '8.2',
    imdbID: 'tt0609857',
    Poster: 'https://example.com/episode.jpg',
    Season: '1',
    Director: 'Graham Linehan',
    Writer: 'Graham Linehan',
    Actors: "Chris O'Dowd, Richard Ayoade, Katherine Parkinson",
    Plot: 'Episode plot',
  };

  await render(<MovieCard episode={episode} showEpisodeDetails />);

  expect(screen.getByText('Episode Details:')).toBeTruthy();
  expect(screen.getByLabelText('IMDb rating 8.2 out of 10')).toHaveTextContent('★ 8.2');
  expect(screen.queryByText('IMDb rating: 8.2')).toBeNull();
  expect(screen.getByText('Episode: 1')).toBeTruthy();
  expect(screen.getByText('Director: Graham Linehan')).toBeTruthy();
  expect(screen.getByText('Writer: Graham Linehan')).toBeTruthy();
  expect(screen.getByText("Actors: Chris O'Dowd, Richard Ayoade, Katherine Parkinson")).toBeTruthy();
  expect(screen.getByText('Plot: Episode plot')).toBeTruthy();
  expect(screen.getByText('IMDb ID: tt0609857')).toBeTruthy();
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
