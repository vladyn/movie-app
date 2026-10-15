import { fireEvent, render, screen } from '@testing-library/react-native';

import { EpisodeScreen } from '../src/components/episode-screen';
import type { Episode } from '../src/services/movie-service';

const mockGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: mockGoBack }),
}));

describe('EpisodeScreen', () => {
  beforeEach(() => mockGoBack.mockReset());

  test('shows the selected episode details', async () => {
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

    await render(<EpisodeScreen route={{ params: { episode } }} />);

    expect(screen.getByText('Yesterday\'s Jam')).toBeTruthy();
    expect(screen.getByText('Season 1')).toBeTruthy();
    expect(screen.getByText('Released: 2006-02-03')).toBeTruthy();
    expect(screen.getByLabelText('IMDb rating 8.2 out of 10')).toHaveTextContent('★ 8.2');
    expect(screen.getByText('Episode Details:')).toBeTruthy();
    expect(screen.getByText('Episode: 1')).toBeTruthy();
    expect(screen.getByText('Director: Graham Linehan')).toBeTruthy();
    expect(screen.getByText('Plot: Episode plot')).toBeTruthy();
    expect(screen.getByText('IMDb ID: tt0609857')).toBeTruthy();
    expect(screen.getByLabelText('Yesterday\'s Jam poster').props.source).toEqual({
      uri: 'https://example.com/episode.jpg',
    });
    fireEvent.press(screen.getByRole('button', { name: 'Back' }));
    expect(mockGoBack).toHaveBeenCalledTimes(1);
  });
});
