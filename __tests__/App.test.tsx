import { fireEvent, render, screen } from '@testing-library/react-native';

import App, { getPosterSize } from '../App';

afterEach(() => {
  jest.restoreAllMocks();
});

test('keeps posters at a portrait aspect ratio within each viewport', () => {
  expect(getPosterSize(320, 568)).toEqual({ width: 208, height: 312 });
  expect(getPosterSize(390, 844)).toEqual({ width: 302, height: 453 });
  expect(getPosterSize(1200, 800)).toEqual({ width: 293, height: 439 });
  expect(getPosterSize(0, 0)).toEqual({ width: 0, height: 0 });
});

test('starts with three movies, their posters, and their descriptions', async () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  await render(<App />);

  expect(screen.getByText('Movie Night')).toBeTruthy();
  expect(screen.getByText('The Last Observatory')).toBeTruthy();
  expect(screen.getByText('Midnight Current')).toBeTruthy();
  expect(screen.getByText('The Glass Garden')).toBeTruthy();
  expect(screen.getAllByLabelText('The Last Observatory poster')).toHaveLength(1);
  expect(screen.getAllByLabelText('Midnight Current poster')).toHaveLength(1);
  expect(screen.getAllByLabelText('The Glass Garden poster')).toHaveLength(1);
  expect(screen.getAllByText('A lone astronomer discovers a signal hidden in the northern lights.')).toHaveLength(1);
  expect(screen.getAllByText('A night voyage follows a glowing current toward a forgotten shore.')).toHaveLength(1);
  expect(screen.getAllByText('An abandoned greenhouse holds the clues to a family secret.')).toHaveLength(1);
  expect(screen.getByTestId('movie-list').props.data).toHaveLength(3);
});

test('rotates the first movie when the random choice changes', async () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.99);
  await render(<App />);

  expect(screen.getByTestId('movie-list').props.data[0].movie.title).toBe('The Glass Garden');
  expect(screen.getAllByLabelText('The Glass Garden poster')).toHaveLength(1);
});

test('loads more movie cards with distinct keys after each content update', async () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  await render(<App />);

  const list = screen.getByTestId('movie-list');
  await fireEvent(list, 'endReached');
  expect(screen.getByTestId('movie-list').props.data).toHaveLength(6);

  await fireEvent(screen.getByTestId('movie-list'), 'endReached');
  expect(screen.getByTestId('movie-list').props.data).toHaveLength(6);

  await fireEvent(screen.getByTestId('movie-list'), 'contentSizeChange');
  await fireEvent(screen.getByTestId('movie-list'), 'endReached');
  const data = screen.getByTestId('movie-list').props.data;
  expect(data).toHaveLength(9);
  expect(new Set(data.map((item: { key: string }) => item.key)).size).toBe(9);
  expect(data.map((item: { movie: { title: string } }) => item.movie.title)).toEqual([
    'The Last Observatory', 'Midnight Current', 'The Glass Garden',
    'The Last Observatory', 'Midnight Current', 'The Glass Garden',
    'The Last Observatory', 'Midnight Current', 'The Glass Garden',
  ]);
});
