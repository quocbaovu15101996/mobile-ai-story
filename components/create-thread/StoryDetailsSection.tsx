import { getImageLink } from '@/src/utils';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import { Image } from 'expo-image';
import React, { FC } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import TextApp from '../TextApp';
import { NARRATIVE } from './useCreateThread';

type Props = {
  extendDetails: boolean;
  setExtendDetails: (val: boolean) => void;
  genres: any[];
  genre: string | null;
  setGenre: (val: string | null) => void;
  characters: string;
  setCharacters: (val: string) => void;
  setting: string;
  setSetting: (val: string) => void;
  narrative: string;
  setNarrative: (val: string) => void;
};

const StoryDetailsSection: FC<Props> = ({
  extendDetails,
  setExtendDetails,
  genres,
  genre,
  setGenre,
  characters,
  setCharacters,
  setting,
  setSetting,
  narrative,
  setNarrative,
}) => {
  const { colors } = useTheme();

  return (
    <>
      <Pressable
        onPress={() => setExtendDetails(!extendDetails)}
        style={styles.detailsToggle}
      >
        <TextApp style={styles.detailsLabel}>More details (optional)</TextApp>
        <Ionicons
          name={extendDetails ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={colors.text}
        />
      </Pressable>
      {extendDetails && (
        <View style={styles.detailsBox}>
          <TextApp style={styles.subLabel}>Genre</TextApp>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.genreRow}
          >
            {genres.map((g) => (
              <Pressable
                key={g.type}
                style={[
                  styles.genreItem,
                  genre === g.type && styles.genreItemActive,
                ]}
                onPress={() => setGenre(g.type)}
              >
                <Image
                  source={{ uri: getImageLink(g.image, 'thumbnail') }}
                  style={styles.genreImage}
                  contentFit="cover"
                  transition={1000}
                />
                <TextApp style={styles.genreText}>{g.name}</TextApp>
              </Pressable>
            ))}
          </ScrollView>

          {/* Character details */}
          <TextApp style={styles.subLabel}>Character details</TextApp>
          <TextInput
            style={styles.textInput}
            placeholder="E.g., A rebellious princess and a humble village boy."
            placeholderTextColor="#888"
            value={characters}
            onChangeText={setCharacters}
            multiline
            textAlignVertical="top"
            numberOfLines={3}
          />

          {/* Story's setting */}
          <TextApp style={styles.subLabel}>Story&apos;s setting</TextApp>
          <TextInput
            style={[styles.textInput, { minHeight: 40 }]}
            placeholder="Where does the story take place?"
            placeholderTextColor="#888"
            value={setting}
            onChangeText={setSetting}
            multiline
          />

          {/* Narrative */}
          <TextApp style={styles.subLabel}>Narrative</TextApp>
          <View style={styles.genreRow}>
            {NARRATIVE.map((n) => (
              <Pressable
                key={n.value}
                style={[
                  styles.genreItem,
                  narrative === n.value && styles.genreItemActive,
                ]}
                onPress={() => setNarrative(n.value)}
              >
                <Image
                  source={{ uri: getImageLink(n.image, 'thumbnail') }}
                  style={styles.genreImage}
                  contentFit="cover"
                  transition={1000}
                />
                <TextApp style={styles.genreText}>{n.label}</TextApp>
              </Pressable>
            ))}
          </View>
        </View>
      )}
    </>
  );
};

export default StoryDetailsSection;

const styles = StyleSheet.create({
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
  },
  detailsBox: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
  },
  subLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 4,
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
    borderColor: '#444',
    backgroundColor: '#1a1a1a',
    minWidth: 70,
  },
  genreItemActive: {
    borderColor: '#6366f1',
    backgroundColor: '#1e1e3f',
  },
  genreImage: {
    width: 60,
    height: 60,
    backgroundColor: '#555',
    borderRadius: 6,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 13,
    fontWeight: '500',
  },
  textInput: {
    minHeight: 60,
    fontSize: 15,
    marginBottom: 6,
    color: '#fff',
  },
});
