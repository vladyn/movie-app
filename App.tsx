import { useRef, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { FlatList, Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { rabbits, type Rabbit } from './src/data/rabbits';

export function getPictureSize(viewportWidth: number, viewportHeight: number) {
  return Math.floor(Math.max(0, Math.min(viewportWidth - 48, viewportHeight * 0.4, 360)));
}

function RabbitProfile({ rabbit, pictureSize }: { rabbit: Rabbit; pictureSize: number }) {
  return (
    <View style={styles.profile}>
      <Text style={styles.eyebrow}>YOUR LITTLE COMPANION</Text>
      <Text style={styles.title}>Meet {rabbit.name}</Text>
      <Text style={styles.subtitle}>Small routines, happy hops.</Text>

      <Image
        accessibilityLabel={`${rabbit.name} the rabbit`}
        source={rabbit.picture}
        style={[styles.picture, { width: pictureSize, height: pictureSize }]}
      />

      <View style={styles.habitsCard}>
        <Text style={styles.habitsTitle}>{rabbit.name}'s habits</Text>
        {rabbit.habits.map((habit) => (
          <View key={habit} style={styles.habitRow}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.habitText}>{habit}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function App() {
  const { width, height } = useWindowDimensions();
  const pictureSize = getPictureSize(width, height);
  const [firstRabbitIndex] = useState(() => Math.floor(Math.random() * rabbits.length));
  const [profileCount, setProfileCount] = useState(rabbits.length);
  const canLoadMore = useRef(false);
  const profiles = Array.from({ length: profileCount }, (_, index) => ({
    id: rabbits[(firstRabbitIndex + index) % rabbits.length].id.toString(),
    rabbit: rabbits[(firstRabbitIndex + index) % rabbits.length],
  }));

  console.log(profiles);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <FlatList
        testID="rabbit-list"
        contentContainerStyle={styles.content}
        data={profiles}
        keyExtractor={(profile) => profile.id}
        ListHeaderComponent={<Text style={styles.brand}>Rabbit Habits</Text>}
        renderItem={({ item }) => <RabbitProfile rabbit={item.rabbit} pictureSize={pictureSize} />}
        onEndReached={() => {
          if (canLoadMore.current) return;
          canLoadMore.current = true;
          setProfileCount((count) => count + rabbits.length);
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
    backgroundColor: '#f5f6ee',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 68,
    paddingBottom: 36,
  },
  brand: {
    color: '#315742',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
    marginBottom: 40,
  },
  profile: {
    marginBottom: 36,
  },
  eyebrow: {
    color: '#71977b',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  title: {
    color: '#243c2d',
    fontSize: 38,
    fontWeight: '800',
    marginTop: 8,
  },
  subtitle: {
    color: '#667d6d',
    fontSize: 16,
    marginTop: 6,
    marginBottom: 24,
  },
  picture: {
    alignSelf: 'center',
    backgroundColor: '#dce8d7',
  },
  habitsCard: {
    backgroundColor: '#ffffff',
    padding: 22,
    marginTop: 22,
  },
  habitsTitle: {
    color: '#243c2d',
    fontSize: 21,
    fontWeight: '800',
    marginBottom: 14,
  },
  habitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  bullet: {
    color: '#6b9b73',
    fontSize: 24,
    lineHeight: 24,
    marginRight: 12,
  },
  habitText: {
    color: '#405847',
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});
