import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../app/_layout';
import { createThread } from '../src/services/api/thread';

type Props = {};

const STORY_TYPE = [
  { key: 'endless', label: 'Endless', subLabel: 'Step-by-step', value: 1 },
  { key: 'story', label: 'Story', subLabel: 'Full story', value: 0 },
];

const STORY_LENGTH = ['Short', 'Medium', 'Long'];

const GENRES = [
  { key: 'romantic', label: 'Romantic', image: null },
  { key: 'fantasy', label: 'Fantasy', image: null },
  { key: 'horror', label: 'Horror', image: null },
  { key: 'adventure', label: 'Adventure', image: null },
  { key: 'sci-fi', label: 'Sci-Fi', image: null },
];

const NARRATIVE = [{
  value: 'FIRST_PERSON',
  label: 'First person',
}, {
  value: 'THIRD_PERSON',
  label: 'Third person',
}];

const CreateThreadBox: FC<Props> = () => {
  const [storyIdea, setStoryIdea] = useState('');
  const [storyType, setStoryType] = useState('endless');
  const [storyLength, setStoryLength] = useState('Short');
  const [extendDetails, setExtendDetails] = useState(false);
  const [genre, setGenre] = useState<string | null>(null);
  const [characters, setCharacters] = useState('');
  const [setting, setSetting] = useState('');
  const [loading, setLoading] = useState(false);
  const [narrative, setNarrative] = useState('FIRST_PERSON');

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isButtonDisabled = !storyIdea || loading;

  const onPressGenerate = async () => {
    setLoading(true);
    try {
      const payload = {
        storyIdea,
        isCanInteract: STORY_TYPE.find((s) => s.key === storyType)?.value || 1,
        storyLength: storyLength.toLocaleUpperCase(),
        genreType: genre,
        characterPrompt: characters,
        settingPrompt: setting,
        narrative: NARRATIVE.find((n) => n.value === narrative)?.value,
      }
      const response = await createThread(payload);

      // Navigate to ThreadDetail after successful creation
      if (response.data && response.data.id) {
        navigation.navigate('ThreadDetail', { threadId: response.data.id });
      }
    } catch (error) {
      // Optionally handle error (e.g., show toast)
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Create story</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Story prompt */}
        <Text style={styles.label}>What do you want to write story about?</Text>
        <View style={styles.inputBox}>
          <TextInput
            style={styles.textInput}
            placeholder="E.g., Love story with two women and one man."
            placeholderTextColor="#bbb"
            value={storyIdea}
            onChangeText={setStoryIdea}
            multiline
            textAlignVertical="top"
            numberOfLines={4}
          />
          <View style={styles.inputIconsRow}>
            <Ionicons
              name="bulb-outline"
              size={22}
              color="#bbb"
              style={styles.iconSuggestion}
            />
            {/* <Ionicons
              name="bulb"
              size={22}
              color="#bbb"
              style={{ marginRight: 8 }}
            /> */}
            <View style={styles.proBadge}>
              <Text style={styles.proText}>Pro</Text>
            </View>
          </View>
        </View>

        {/* Story size */}
        <Text style={styles.label}>Story size</Text>
        <View style={styles.storySizeRow}>
          {STORY_TYPE.map((s) => (
            <TouchableOpacity
              key={s.key}
              style={[
                styles.sizeButton,
                storyType === s.key && styles.sizeButtonActive,
              ]}
              onPress={() => setStoryType(s.key)}
            >
              <Text style={styles.sizeButtonText}>{s.label}</Text>
              <Text style={styles.sizeButtonSub}>{s.subLabel}</Text>
              {storyType === s.key && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color="#222"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        {storyType === 'story' && <View style={styles.storySizeRow}>
          {STORY_LENGTH.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.sizeButton,
                storyLength === s && styles.sizeButtonActive,
              ]}
              onPress={() => setStoryLength(s)}
            >
              <Text style={styles.sizeButtonText}>{s}</Text>
              {storyLength === s && (
                <Ionicons
                  name="checkmark"
                  size={18}
                  color="#222"
                  style={styles.checkIcon}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
        }

        {/* More details (optional) */}
        <Pressable
          onPress={() => setExtendDetails(!extendDetails)}
          style={styles.detailsToggle}
        >
          <Text style={styles.detailsLabel}>More details (optional)</Text>
          <Ionicons
            name={extendDetails ? 'chevron-up' : 'chevron-down'}
            size={20}
            color="#222"
          />
        </Pressable>
        {extendDetails && (
          <View style={styles.detailsBox}>
            {/* Genre */}
            <Text style={styles.subLabel}>Genre</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.genreRow}
            >
              {GENRES.map((g) => (
                <TouchableOpacity
                  key={g.key}
                  style={[
                    styles.genreItem,
                    genre === g.key && styles.genreItemActive,
                  ]}
                  onPress={() => setGenre(g.key)}
                >
                  <View style={styles.genreImagePlaceholder} />
                  <Text style={styles.genreText}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Character details */}
            <Text style={styles.subLabel}>Character details</Text>
            <TextInput
              style={styles.textInput}
              placeholder="E.g., A rebellious princess and a humble village boy."
              placeholderTextColor="#bbb"
              value={characters}
              onChangeText={setCharacters}
              multiline
            />

            {/* Story's setting */}
            <Text style={styles.subLabel}>Story’s setting</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Where does the story take place?"
              placeholderTextColor="#bbb"
              value={setting}
              onChangeText={setSetting}
              multiline
            />
            {/* Narrative */}
            <Text style={styles.subLabel}>Narrative</Text>
            <View style={styles.genreRow}>
              {NARRATIVE.map((n) => (
                <TouchableOpacity
                  key={n.value}
                  style={[
                    styles.genreItem,
                    narrative === n.value && styles.genreItemActive,
                  ]}
                  onPress={() => setNarrative(n.value)}
                >
                  <View style={styles.genreImagePlaceholder} />
                  <Text style={styles.genreText}>{n.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Start generate button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            isButtonDisabled && styles.generateButtonDisabled,
          ]}
          disabled={isButtonDisabled}
          onPress={onPressGenerate}
        >
          <Text style={styles.generateButtonText}>
            {loading ? 'Generating...' : 'Start generate'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateThreadBox;

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  inputBox: {
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  textInput: {
    minHeight: 60,
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
  },
  inputIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  storySizeRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    padding: 12,
    marginRight: 10,
    backgroundColor: '#fff',
    minWidth: 100,
    position: 'relative',
  },
  sizeButtonActive: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  sizeButtonText: {
    fontWeight: '600',
    color: '#222',
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
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    marginTop: 4,
    paddingVertical: 8,
  },
  detailsLabel: {
    fontWeight: '600',
    fontSize: 15,
    color: '#222',
  },
  detailsBox: {
    backgroundColor: '#f5f5f7',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
    color: '#222',
  },
  genreRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  genreItem: {
    alignItems: 'center',
    marginRight: 12,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    minWidth: 70,
  },
  genreItemActive: {
    borderColor: '#6366f1',
    backgroundColor: '#eef2ff',
  },
  genreImagePlaceholder: {
    width: 60,
    height: 40,
    backgroundColor: '#ddd',
    borderRadius: 6,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 13,
    color: '#222',
    fontWeight: '500',
  },
  generateButton: {
    backgroundColor: '#6366f1',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  generateButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  iconSuggestion: { marginRight: 8 }
});
