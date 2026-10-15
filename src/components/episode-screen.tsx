import { MovieCard } from './movie-card';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from "@react-navigation/native";

import type { Episode } from '../services/movie-service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0f2b',
  },
  content: {
    alignItems: 'center',
    padding: 16,
  },
});

export const EpisodeScreen = ({ route }: { route: { params: { episode: Episode } } }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <MovieCard episode={route.params.episode} showEpisodeDetails width={360} height={600} />
      </ScrollView>
      <Button title="Back" onPress={() => navigation.goBack()} />
    </View>
  );
};
