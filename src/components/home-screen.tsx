import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, StyleSheet, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { MovieCard } from './movie-card';

import {
  searchMovies,
  searchEpisodes,
  type Episode,
  type SeriesResponse,
  getEpisodeDetails
} from '../services/movie-service';

type RootStackParamList = {
  Season: undefined;
  Episode: { episode: Episode };
};

export function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [isHorizontal, setIsHorizontal] = useState(false);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [movie, setMovie] = useState<null | SeriesResponse>(null);
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [movie, season] = await Promise.all([
          searchMovies('it crowd'),
          searchEpisodes('it crowd'),
        ]);

        const episodes = await Promise.all(
            // Get each episode's details, because of the missing poster image. Poster is only available in the episode details, not in the season response.
            // We need the poster to construct the slider
            season.Episodes.map(async (episode) => {
              try {
                const details = await getEpisodeDetails(episode.imdbID);
                return {
                  ...episode,
                  ...details,
                };
              } catch {
                return { ...episode, Season: season.Season }; // Keep the season data if one detail request fails.
              }
            }),
        );

        if (!active) return;
        setMovie(movie);
        setEpisodes(episodes);
        setLoadState('ready');
      } catch {
        if (active) setLoadState('error');
      }
    }

    void load();
    return () => { active = false; };
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
        keyExtractor={( episode) => episode.imdbID }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.eyebrow}>{movie?.Title}</Text>
            <Text style={styles.brand}>{movie?.Year}</Text>
            <Text style={styles.details}>IMDb ID: {movie?.imdbID}</Text>
            <Image source={{ uri: movie?.Poster }} style={styles.poster} />
            <Text style={styles.subtitle}>{movie?.imdbRating}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <MovieCard
            episode={item}
            onPress={() => navigation.navigate('Episode', { episode: item })}
          />
        )}
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
    backgroundColor: '#230e40',
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
