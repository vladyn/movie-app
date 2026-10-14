import { createStaticNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from './src/components/home-screen';
import { EpisodeScreen } from './src/components/episode-screen';

const RootStack = createNativeStackNavigator({
  screens: {
    Season: {
      screen: HomeScreen,
    },
    Episode: {
      screen: EpisodeScreen,
    },
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
