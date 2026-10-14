import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, StyleSheet, Switch, Text, View } from 'react-native';

import { searchMovies, type Episode, searchEpisodes, getEpisodeDetails, type Movie } from './src/services/movie-service';

function MovieCard({ episode }: { episode: Episode }) {
  return (
    <View style={styles.card}>
      <Image  accessibilityLabel={`${episode.Title} poster`}
        source={episode.Poster}
        style={styles.poster}
        />
      <Text style={styles.movieTitle}>{episode.Title}</Text>
      <Text style={styles.details}>Episode {episode.Episode}</Text>
      <Text style={styles.details}>Released: {episode.Released}</Text>
      <Text style={styles.details}>IMDb rating: {episode.imdbRating}</Text>
      <Text style={styles.details}>IMDb ID: {episode.imdbID}</Text>
    </View>
  );
}

export default function App() {
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [movie, setMovie] = useState<null | Movie>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    Promise.all([
      searchMovies('it crowd'),
      searchEpisodes('it crowd'),
    ])
        .then(([movie, season]) => {
          setMovie(movie);
          setEpisodes(season.Episodes);
          setLoadState('ready');
        })
        .catch(() => setLoadState('error'));
  }, []);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.layoutControl}>
        <Text style={styles.layoutLabel}>Horizontal</Text>
        <Switch
          accessibilityLabel="Horizontal"
          value={isHorizontal}
          onValueChange={setIsHorizontal}
        />
      </View>
      <FlatList
        testID="movie-list"
        contentContainerStyle={styles.content}
        horizontal={isHorizontal}
        data={episodes}
        keyExtractor={(episode) => episode.imdbID}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>{movie?.Title}</Text>
            <Text style={styles.brand}>{movie?.Year}</Text>
            <Text style={styles.details}>IMDb ID: {movie?.imdbID}</Text>
            <Text style={styles.details}>Poster: {movie?.Poster}</Text>
            <Text style={styles.subtitle}>{movie?.Ratings}</Text>
          </View>
        }
        renderItem={({ item }) => <MovieCard episode={item} />}
        onEndReachedThreshold={1}
        ListEmptyComponent={
          <Text style={styles.details}>
            {loadState === 'loading'
              ? 'Loading episodes...'
              : loadState === 'error'
                ? 'Could not load episodes.'
                : 'No episodes found.'}
          </Text>
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 36,
  },
  header: {
    alignSelf: 'stretch',
    marginBottom: 28,
  },
  eyebrow: {
    color: '#fda05c',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
  },
  layoutControl: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  layoutLabel: {
    color: '#96dfff',
    fontSize: 15,
    marginRight: 12,
  },
  brand: {
    color: '#96dfff',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: '#739ddc',
    fontSize: 15,
    marginTop: 6,
  },
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
  }
});
