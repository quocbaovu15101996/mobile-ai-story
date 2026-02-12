import { MESSAGE_TYPE, ROLE } from '@/constants';
import { showSuccessToast } from '@/src/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import TextApp from '../TextApp';
import { ThemedView } from '../ThemedView';

type Props = {
  item: MessageItemInterface,
  onReport: (messageId: string) => void
}
const MessageItem: React.FC<Props> = ({ item, onReport }) => {
  const { colors } = useTheme();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(item.content.text.value);
    showSuccessToast('Copied to clipboard');
  };

  if (item.role === ROLE.ASSISTANT) {
    return (
      <ThemedView style={styles.container}>
        <TextApp style={styles.storyText}>
          {item.content.text.value}
        </TextApp>
        <View style={styles.actionContainer}>
          <Pressable style={styles.btnAction} onPress={handleCopy}>
            <Ionicons name="copy-outline" size={18} color={colors.text} style={{ opacity: 0.5 }} />
          </Pressable>
          <Pressable style={styles.btnAction} onPress={onReport.bind(null, item.id)} disabled={!!item.flagNSFW}>
            <Ionicons name="flag-outline" size={18} color={item.flagNSFW ? 'yellow' : colors.text} style={{ opacity: item.flagNSFW ? 1 : 0.5 }} />
          </Pressable>
        </View>
      </ThemedView>
    )
  }
  if (item.role === ROLE.USER && [MESSAGE_TYPE.CONTINUE, MESSAGE_TYPE.EXPAND].includes(item?.metadata?.type)) {
    return (
      <ThemedView style={styles.messageAction}>
        <Ionicons name={item?.metadata?.type === MESSAGE_TYPE.CONTINUE ? 'play' : 'expand'} size={14} color="#fff" />
        <TextApp style={styles.txtAction}>
          {item?.metadata?.type === MESSAGE_TYPE.CONTINUE ? 'Continue' : item?.metadata?.content}
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
    borderRadius: 12,
    position: 'relative',
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'justify',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 12,
  },
  btnAction: {
    padding: 4,
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
  txtAction: {
    fontSize: 14,
    fontWeight: 'bold',
  },
})