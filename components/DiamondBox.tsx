import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import TextApp from './TextApp';

type Props = {
  onPress: () => void;
  diamond?: number;
};

const DiamondBox: React.FC<Props> = ({ onPress, diamond }) => {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.tokenBox,
        pressed && { opacity: 0.7 },
      ]}
      onPress={onPress}
    >
      <Ionicons name="diamond" size={20} color="#7ee2ff" />
      <TextApp style={styles.tokenValue}>{diamond || 0}</TextApp>
    </Pressable>
  );
};

export { DiamondBox };

const styles = StyleSheet.create({
  tokenBox: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7ee2ff',
  },
});
