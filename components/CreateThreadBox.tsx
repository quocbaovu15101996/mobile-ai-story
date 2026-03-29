import { useTheme } from '@react-navigation/native';
import React, { FC } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import TextApp from './TextApp';
import GenerateButton from './create-thread/GenerateButton';
import StoryDetailsSection from './create-thread/StoryDetailsSection';
import StoryPromptSection from './create-thread/StoryPromptSection';
import StorySizeSection from './create-thread/StorySizeSection';
import { useCreateThread } from './create-thread/useCreateThread';

type Props = {};

const CreateThreadBox: FC<Props> = () => {
  const { colors } = useTheme();
  const {
    userProfile,
    genres,
    storyIdea,
    setStoryIdea,
    storyType,
    setStoryType,
    storyLength,
    setStoryLength,
    extendDetails,
    setExtendDetails,
    genre,
    setGenre,
    characters,
    setCharacters,
    setting,
    setSetting,
    narrative,
    setNarrative,
    loading,
    loadingAds,
    loadingSuggestIdea,
    isButtonDisabled,
    onPressGenerate,
    onPressSuggestIdea,
  } = useCreateThread();

  return (
    <KeyboardAvoidingView
      style={styles.flex1}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TextApp style={styles.title}>Create story</TextApp>
          <View style={{ width: 28 }} />
        </View>

        <StoryPromptSection
          storyIdea={storyIdea}
          setStoryIdea={setStoryIdea}
          onPressSuggestIdea={onPressSuggestIdea}
          loadingSuggestIdea={loadingSuggestIdea}
        />

        <StorySizeSection
          storyType={storyType}
          setStoryType={setStoryType}
          storyLength={storyLength}
          setStoryLength={setStoryLength}
        />

        <StoryDetailsSection
          extendDetails={extendDetails}
          setExtendDetails={setExtendDetails}
          genres={genres}
          genre={genre}
          setGenre={setGenre}
          characters={characters}
          setCharacters={setCharacters}
          setting={setting}
          setSetting={setSetting}
          narrative={narrative}
          setNarrative={setNarrative}
        />

        <GenerateButton
          isButtonDisabled={isButtonDisabled}
          isVip={userProfile?.isVip}
          loading={loading}
          loadingAds={loadingAds}
          onPressGenerate={onPressGenerate}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateThreadBox;

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  container: {
    padding: 20,
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
  },
});
