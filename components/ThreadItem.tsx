import { RootStackParamList } from '@/app/_layout';
import { analyticsService } from '@/src/services/analyticsService';
import { DEFAULT_THREAD_IMAGE, getImageLink, SCREEN_WIDTH } from '@/src/utils';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import TextApp from './TextApp';
import { ThemedView } from './ThemedView';

interface ThreadItemProps {
  thread: Thread;
  genres: Genre[];
}

export const ThreadItem: React.FC<ThreadItemProps> = ({ thread, genres }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handlePress = () => {
    analyticsService.logThreadViewed(thread.threadId, false);
    navigation.navigate('ThreadDetail', { threadId: thread.threadId, isCreate: false });
  };

  return (
    <ThemedView style={styles.container}>
      <Image
        source={{ uri: thread?.genre ? getImageLink(genres.find(g => g.type === thread?.genre)?.image || '', 'medium') : DEFAULT_THREAD_IMAGE }}
        style={styles.image}
        resizeMode="cover"
      />
      <Pressable style={({ pressed }) => pressed && { opacity: 0.7 }} onPress={handlePress}>
        <View style={styles.contentContainer}>
          <TextApp style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {thread.title}
          </TextApp>
          <TextApp style={styles.content} numberOfLines={3} ellipsizeMode="tail">
            {thread.content}
          </TextApp>
          <TextApp style={styles.date}>
            {new Date(thread.createdDate).toLocaleDateString()}
          </TextApp>
        </View>
      </Pressable>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 8,
    width: (SCREEN_WIDTH - 20) / 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contentContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
  },
  image: {
    width: (SCREEN_WIDTH - 56) / 2,
    height: (SCREEN_WIDTH - 56) / 2,
    borderRadius: 8,
  },
});