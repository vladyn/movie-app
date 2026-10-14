import { render, screen } from '@testing-library/react-native';

import App from '../App';

jest.mock('../src/components/home-screen', () => ({
  HomeScreen: () => require('react').createElement(
    require('react-native').Text,
    null,
    'Season screen',
  ),
}));

test('opens the season screen from the root navigator', async () => {
  await render(<App />);

  expect(screen.getByText('Season screen')).toBeTruthy();
});
