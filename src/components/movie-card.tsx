import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Episode } from '../services/movie-service';

type MovieCardProps = {
  episode: Episode;
  onPress?: () => void;
  width?: number;
  height?: number;
};

export function MovieCard({ episode, onPress, width = 290, height }: MovieCardProps) {
  const content = (
    <>
      <Image
        accessibilityLabel={`${episode.Title} poster`}
        source={{ uri: episode.Poster }}
        style={styles.poster}
      />
      <Text style={styles.movieTitle}>{episode.Title}</Text>
      <Text style={styles.details}>Episode {episode.Episode}</Text>
      <Text style={styles.details}>Released: {episode.Released}</Text>
      <Text style={styles.details}>IMDb rating: {episode.imdbRating}</Text>
    </>
  );

  return onPress ? (
    <Pressable accessibilityRole="button" style={[styles.card, { width, height }]} onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    <View style={[styles.card, { width, height }]}>{content}</View>
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
    flexShrink: 1,
    marginBottom: 16,
  },
});
