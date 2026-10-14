import { render, screen } from '@testing-library/react-native';

import { EpisodeScreen } from '../src/components/episode-screen';
import type { Episode } from '../src/services/movie-service';

describe('EpisodeScreen', () => {
  test('shows the selected episode details', async () => {
    const episode: Episode = {
      Title: 'Yesterday\'s Jam',
      Released: '2006-02-03',
      Episode: '1',
      imdbRating: '8.2',
      imdbID: 'tt0609857',
      Poster: 'https://example.com/episode.jpg',
    };

    await render(<EpisodeScreen route={{ params: { episode } }} />);

    expect(screen.getByText('Yesterday\'s Jam')).toBeTruthy();
    expect(screen.getByText('Episode 1')).toBeTruthy();
    expect(screen.getByText('Released: 2006-02-03')).toBeTruthy();
    expect(screen.getByText('IMDb rating: 8.2')).toBeTruthy();
    expect(screen.getByLabelText('Yesterday\'s Jam poster').props.source).toEqual({
      uri: 'https://example.com/episode.jpg',
    });
    expect(screen.queryByRole('button')).toBeNull();
  });
});
