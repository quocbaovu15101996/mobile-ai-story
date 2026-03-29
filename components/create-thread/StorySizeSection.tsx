import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import TextApp from '../TextApp';
import { STORY_LENGTH, STORY_TYPE } from './useCreateThread';

type Props = {
  storyType: string;
  setStoryType: (type: string) => void;
  storyLength: string;
  setStoryLength: (length: string) => void;
};

const StorySizeSection: FC<Props> = ({
  storyType,
  setStoryType,
  storyLength,
  setStoryLength,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <TextApp style={styles.label}>Story size</TextApp>
      <View style={styles.storySizeRow}>
        {STORY_TYPE.map((s) => (
          <Pressable
            key={s.key}
            style={[
              styles.sizeButton,
              storyType === s.key && styles.sizeButtonActive,
            ]}
            onPress={() => setStoryType(s.key)}
          >
            <TextApp style={styles.sizeButtonText}>{s.label}</TextApp>
            <TextApp style={styles.sizeButtonSub}>{s.subLabel}</TextApp>
            {storyType === s.key && (
              <Ionicons
                name="checkmark"
                size={18}
                color={colors.text}
                style={styles.checkIcon}
              />
            )}
          </Pressable>
        ))}
      </View>
      {storyType === 'story' && (
        <View style={styles.storySizeRow}>
          {STORY_LENGTH.map((s) => (
            <Pressable
              key={s}
              style={[
                styles.sizeButton,
                storyLength === s && styles.sizeButtonActive,
              ]}
              onPress={() => setStoryLength(s)}
            >
              <TextApp style={styles.sizeButtonText}>{s}</TextApp>
              {storyLength === s && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color={colors.text}
                  style={styles.checkIcon}
                />
              )}
            </Pressable>
          ))}
        </View>
      )}
    </>
  );
};

export default StorySizeSection;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  storySizeRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#2a2a2a',
    minWidth: 100,
    position: 'relative',
  },
  sizeButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: '#1e1e3f',
  },
  sizeButtonText: {
    fontWeight: '600',
    fontSize: 15,
  },
  sizeButtonSub: {
    fontSize: 12,
    color: '#888',
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});
