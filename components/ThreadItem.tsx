import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { Thread } from '@/src/services/api/types';

interface ThreadItemProps {
  thread: Thread;
}

export const ThreadItem: React.FC<ThreadItemProps> = ({ thread }) => {
  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {thread.title}
        </Text>
        <Text style={styles.content} numberOfLines={3} ellipsizeMode="tail">
          {thread.content}
        </Text>
        <Text style={styles.date}>
          {new Date(thread.createdAt).toLocaleDateString()}
        </Text>
      </View>
      {thread.image && (
        <Image
          source={{ uri: thread.image }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
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
    color: '#333333',
    marginBottom: 8,
  },
  content: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999999',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
});