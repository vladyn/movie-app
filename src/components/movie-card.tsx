import { Image, StyleSheet, Text, View } from 'react-native';

import type { Episode } from '../services/movie-service';

export function MovieCard({ episode }: { episode: Episode }) {
  return (
    <View style={styles.card}>
      <Image
        accessibilityLabel={`${episode.Title} poster`}
        source={{ uri: episode.Poster }}
        style={styles.poster}
      />
      <Text style={styles.movieTitle}>{episode.Title}</Text>
      <Text style={styles.details}>Episode {episode.Episode}</Text>
      <Text style={styles.details}>Released: {episode.Released}</Text>
      <Text style={styles.details}>IMDb rating: {episode.imdbRating}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: '#2d194e',
    borderColor: '#875aca',
    borderWidth: 1,
    marginBottom: 20,
    marginRight: 20,
    overflow: 'hidden',
    padding: 20,
    width: 260,
  },
  movieTitle: {
    color: '#c12298',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  details: {
    color: '#bcdf88',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  poster: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
});
