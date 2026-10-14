import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Episode } from '../services/movie-service';

type MovieCardProps = {
  episode: Episode;
  onPress?: () => void;
  showEpisodeDetails?: boolean;
  width?: number;
  height?: number;
};

export function MovieCard({ episode, onPress, showEpisodeDetails = false, width = 290, height = 560 }: MovieCardProps) {
  const content = (
    <>
      <Image
        accessibilityLabel={`${episode.Title} poster`}
        source={{ uri: episode.Poster }}
        style={styles.poster}
      />
      <Text style={styles.movieTitle}>{episode.Title}</Text>
      <Text style={styles.details}>Season {episode.Season}</Text>
      <Text style={styles.details}>Released: {episode.Released}</Text>
      <Text style={styles.details}>IMDb rating: {episode.imdbRating}</Text>
      {showEpisodeDetails && (
        <>
          <Text style={styles.details}>Episode Details:</Text>
          <Text style={styles.details}>Episode: {episode.Episode}</Text>
          <Text style={styles.details}>Director: {episode.Director}</Text>
          <Text style={styles.details}>Writer: {episode.Writer}</Text>
          <Text style={styles.details}>Actors: {episode.Actors}</Text>
          <Text style={styles.details}>Plot: {episode.Plot}</Text>
          <Text style={styles.details}>IMDb ID: {episode.imdbID}</Text>
        </>
      )}
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
    width: 250,
    height: 300,
    resizeMode: 'cover',
    flexShrink: 1,
    marginBottom: 16,
  },
});
