import { fireEvent, render, screen } from '@testing-library/react-native';

import App, { getPictureSize } from '../App';

afterEach(() => {
  jest.restoreAllMocks();
});

test('keeps rabbit pictures within narrow portrait screens', () => {
  expect(getPictureSize(320, 568)).toBe(227);
  expect(getPictureSize(390, 844)).toBe(337);
  expect(getPictureSize(1200, 800)).toBe(320);
});

test('starts with all three rabbits and their habits', async () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  await render(<App />);

  expect(screen.getByText('Rabbit Habits')).toBeTruthy();
  expect(screen.getByText('Meet Pip')).toBeTruthy();
  expect(screen.getByText('Meet Mochi')).toBeTruthy();
  expect(screen.getByText('Meet Clover')).toBeTruthy();
  expect(screen.getAllByLabelText('Pip the rabbit')).toHaveLength(2);
  expect(screen.getAllByLabelText('Mochi the rabbit')).toHaveLength(2);
  expect(screen.getAllByLabelText('Clover the rabbit')).toHaveLength(2);
  expect(screen.getAllByText('Nibble fresh greens')).toHaveLength(2);
  expect(screen.getAllByText('Explore the garden')).toHaveLength(2);
  expect(screen.getAllByText('Rest in a cozy corner')).toHaveLength(2);
  expect(screen.getAllByText('•')).toHaveLength(9);
  expect(screen.getByTestId('rabbit-list').props.data).toHaveLength(3);
});

test('can show another rabbit when the random choice changes', async () => {
  jest.spyOn(Math, 'random').mockReturnValue(0.99);
  await render(<App />);

  expect(screen.getByText('Meet Clover')).toBeTruthy();
  expect(screen.getAllByLabelText('Clover the rabbit')).toHaveLength(2);
  expect(screen.getAllByText('Collect soft leaves')).toHaveLength(2);
  expect(screen.getByTestId('rabbit-list').props.data[0].rabbit.name).toBe('Clover');
});

test('loads more rabbit profiles each time the list reaches the end', async () => {
  jest.spyOn(Math, 'random').mockReturnValue(0);
  await render(<App />);

  const list = screen.getByTestId('rabbit-list');
  expect(screen.getAllByText('Meet Pip')).toHaveLength(1);

  await fireEvent(list, 'scrollBeginDrag');
  await fireEvent(list, 'endReached');
  expect(screen.getAllByText('Meet Pip')).toHaveLength(2);
  expect(screen.getAllByText('Meet Mochi')).toHaveLength(2);
  expect(screen.getAllByText('Meet Clover')).toHaveLength(2);

  await fireEvent(screen.getByTestId('rabbit-list'), 'endReached');
  expect(screen.getByTestId('rabbit-list').props.data).toHaveLength(6);

  await fireEvent(screen.getByTestId('rabbit-list'), 'scrollBeginDrag');
  await fireEvent(screen.getByTestId('rabbit-list'), 'endReached');
  expect(screen.getByTestId('rabbit-list').props.data).toHaveLength(9);
});
