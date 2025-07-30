import { MessageItemInterface } from '@/src/services/api/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet } from 'react-native';
import TextApp from '../TextApp';
import { ThemedView } from '../ThemedView';

type Props = {
  item: MessageItemInterface
}
const MessageItem: React.FC<Props> = ({ item }) => {
  if (item.role === 'assistant') {
    return (
      <ThemedView style={styles.container}>
        <TextApp style={styles.storyText}>
          {item.content.text.value}
        </TextApp>
      </ThemedView>
    )
  }
  if (item.role === 'user' && ['continue', 'expand'].includes(item?.metadata?.type)) {
    return (
      <ThemedView style={styles.messageAction}>
        <Ionicons name={item?.metadata?.type === 'continue' ? 'play' : 'expand'} size={14} color="#fff" />
        <TextApp>
          {item?.metadata?.type}
        </TextApp>
      </ThemedView>
    )
  }
  return null;
};

export { MessageItem };

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginHorizontal: 12,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'justify',
  },
  messageAction: {
    borderRadius: 24,
    backgroundColor: 'gray',
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 12,
  },
})