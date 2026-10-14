import type { ImageSourcePropType } from 'react-native';

export type Movie = {
  id: string;
  title: string;
  description: string;
  thumbnail: ImageSourcePropType;
};

export const movies: Movie[] = [
  {
    id: 'last-observatory',
    title: 'The Last Observatory',
    description: 'A lone astronomer discovers a signal hidden in the northern lights.',
    thumbnail: require('../../assets/movies/last-observatory.png'),
  },
  {
    id: 'midnight-current',
    title: 'Midnight Current',
    description: 'A night voyage follows a glowing current toward a forgotten shore.',
    thumbnail: require('../../assets/movies/midnight-current.png'),
  },
  {
    id: 'glass-garden',
    title: 'The Glass Garden',
    description: 'An abandoned greenhouse holds the clues to a family secret.',
    thumbnail: require('../../assets/movies/glass-garden.png'),
  },
];
