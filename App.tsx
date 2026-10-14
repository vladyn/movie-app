import { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { movies, type Movie } from './src/data/movies';

export function getPosterSize(viewportWidth: number, viewportHeight: number) {
  const width = Math.floor(Math.max(0, Math.min(viewportWidth - 88, viewportHeight * 0.55 * 2 / 3, 360)));
  return { width, height: Math.floor(width * 1.5) };
}

function MovieCard({ movie, posterSize }: { movie: Movie; posterSize: ReturnType<typeof getPosterSize> }) {
  return (
    <View style={styles.card}>
      <Image
        accessibilityLabel={`${movie.title} poster`}
        source={movie.thumbnail}
        style={[styles.poster, posterSize]}
      />
      <Text style={styles.movieTitle}>{movie.title}</Text>
      <Text style={styles.description}>{movie.description}</Text>
    </View>
  );
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const posterSize = getPosterSize(width, height);
  const [firstMovieIndex] = useState(() => Math.floor(Math.random() * movies.length));
  const [movieCount, setMovieCount] = useState(movies.length);
  const canLoadMore = useRef(false);
  const cards = Array.from({ length: movieCount }, (_, index) => {
    const movie = movies[(firstMovieIndex + index) % movies.length];
    return { key: `${movie.id}-${index}`, movie };
  });

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <FlatList
        testID="movie-list"
        contentContainerStyle={styles.content}
        data={cards}
        keyExtractor={(card) => card.key}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>TONIGHT'S PICKS</Text>
            <Text style={styles.brand}>Movie Night</Text>
            <Text style={styles.subtitle}>Stories worth staying up for.</Text>
          </View>
        }
        renderItem={({ item }) => <MovieCard movie={item.movie} posterSize={posterSize} />}
        onEndReached={() => {
          if (canLoadMore.current) return;
          canLoadMore.current = true;
          setMovieCount((count) => count + movies.length);
        }}
        onContentSizeChange={() => {
          canLoadMore.current = false;
        }}
        onEndReachedThreshold={1}
        showsVerticalScrollIndicator={false}
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
    color: '#a8e9dc',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2.2,
  },
  brand: {
    color: '#f7f8fb',
    fontSize: 36,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: '#9da9bb',
    fontSize: 15,
    marginTop: 6,
  },
  card: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: '#151c2a',
    borderColor: '#283246',
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
    padding: 20,
  },
  poster: {
    borderRadius: 12,
    backgroundColor: '#283246',
  },
  movieTitle: {
    alignSelf: 'stretch',
    color: '#f7f8fb',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    marginTop: 18,
  },
  description: {
    alignSelf: 'stretch',
    color: '#aab5c5',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
});
