import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import TextApp from '../TextApp';

type Props = {
  storyIdea: string;
  setStoryIdea: (text: string) => void;
  onPressSuggestIdea: () => void;
  loadingSuggestIdea: boolean;
};

const StoryPromptSection: FC<Props> = ({
  storyIdea,
  setStoryIdea,
  onPressSuggestIdea,
  loadingSuggestIdea,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <TextApp style={styles.label}>
        What do you want to write story about?
      </TextApp>
      <View style={styles.inputBox}>
        <TextInput
          style={[styles.textInput, { color: colors.text }]}
          placeholder="E.g., Romantic story about a couple in the city..."
          placeholderTextColor="#888"
          value={storyIdea}
          onChangeText={setStoryIdea}
          multiline
          textAlignVertical="top"
          numberOfLines={4}
          maxLength={250}
        />
        <Pressable
          style={styles.btnSuggestIdea}
          onPress={onPressSuggestIdea}
          disabled={loadingSuggestIdea}
        >
          <Ionicons
            name={loadingSuggestIdea ? 'hourglass-outline' : 'bulb-outline'}
            size={22}
            color={loadingSuggestIdea ? '#6366f1' : '#888'}
            style={styles.iconSuggestion}
          />
          <View style={styles.proBadge}>
            <TextApp style={styles.proText}>Pro</TextApp>
          </View>
        </Pressable>
      </View>
    </>
  );
};

export default StoryPromptSection;

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  textInput: {
    minHeight: 60,
    fontSize: 15,
    marginBottom: 6,
  },
  btnSuggestIdea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSuggestion: {
    marginRight: 8,
  },
  proBadge: {
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  proText: {
    color: '#6366f1',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
