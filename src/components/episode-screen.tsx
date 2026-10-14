import { MovieCard } from './movie-card';
import { Button, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";

import type { Episode } from '../services/movie-service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a0f2b',
  },
});

export const EpisodeScreen = ({ route }: { route: { params: { episode: Episode } } }) => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
        <MovieCard episode={route.params.episode} showEpisodeDetails width={360} height={600} />
        <Button title={"Back"} onPress={() => navigation.goBack()} />
    </View>
  );
};
