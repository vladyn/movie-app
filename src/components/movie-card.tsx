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
  const cardStyle = [
    styles.card,
    showEpisodeDetails && styles.expandedCard,
    { width, ...(showEpisodeDetails ? { minHeight: height } : { height }) },
  ];
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
      <Text style={styles.details}>Genre: {episode.Genre}</Text>
      <Text style={styles.details}>Country: {episode.Country}</Text>
      {!showEpisodeDetails && <Text style={styles.details}></Text>}
      {showEpisodeDetails && (
        <View style={styles.episodeDetails}>
          <View style={styles.detailsHeader}>
            <Text style={styles.detailsHeading}>Episode Details:</Text>
            <Text
              accessibilityLabel={`IMDb rating ${episode.imdbRating} out of 10`}
              style={styles.rating}
            >
              ★ {episode.imdbRating}
            </Text>
          </View>
          <Text style={styles.detailRow}><Text style={styles.detailLabel}>Episode: </Text>{episode.Episode}</Text>
          <Text style={styles.detailRow}><Text style={styles.detailLabel}>Director: </Text>{episode.Director}</Text>
          <Text style={styles.detailRow}><Text style={styles.detailLabel}>Writer: </Text>{episode.Writer}</Text>
          <Text style={styles.detailRow}><Text style={styles.detailLabel}>Actors: </Text>{episode.Actors}</Text>
          <Text style={styles.plot}><Text style={styles.detailLabel}>Plot: </Text>{episode.Plot}</Text>
          <Text style={styles.imdbId}>IMDb ID: {episode.imdbID}</Text>
        </View>
      )}
    </>
  );

  return onPress ? (
    <Pressable accessibilityRole="button" style={cardStyle} onPress={onPress}>
      {content}
    </Pressable>
  ) : (
    <View style={cardStyle}>{content}</View>
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
  expandedCard: {
    marginRight: 0,
    maxWidth: '100%',
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
  episodeDetails: {
    alignSelf: 'stretch',
    borderTopColor: '#875aca',
    borderTopWidth: 1,
    marginTop: 18,
    paddingTop: 16,
  },
  detailsHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailsHeading: {
    color: '#f1d7ff',
    fontSize: 17,
    fontWeight: '700',
  },
  rating: {
    backgroundColor: '#493161',
    borderRadius: 12,
    color: '#ffd66b',
    fontSize: 15,
    fontWeight: '700',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 8,
  },
  detailRow: {
    color: '#e8def0',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
  },
  detailLabel: {
    color: '#bcdf88',
    fontWeight: '700',
  },
  plot: {
    color: '#e8def0',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
  },
  imdbId: {
    color: '#ac9cba',
    fontSize: 12,
    marginTop: 14,
  },
  poster: {
    width: 250,
    height: 300,
    resizeMode: 'cover',
    flexShrink: 1,
    marginBottom: 16,
  },
});
