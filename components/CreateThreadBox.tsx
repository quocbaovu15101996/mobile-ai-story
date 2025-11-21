import { ADMOB_ADS } from '@/config/admob-config';
import { createThread, generateIdea } from '@/src/services/api/thread';
import { useUserProfile } from '@/src/store';
import { showErrorToast } from '@/src/utils/toast';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useTheme } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { RootStackParamList } from '../app/_layout';
import TextApp from './TextApp';

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

const NARRATIVE = [
  {
    value: 'FIRST_PERSON',
    label: 'First person',
  },
  {
    value: 'THIRD_PERSON',
    label: 'Third person',
  },
];

const CreateThreadBox: FC<Props> = () => {
  const { colors } = useTheme();
  const userProfile = useUserProfile();

  const [storyIdea, setStoryIdea] = useState('');
  const [storyType, setStoryType] = useState('endless');
  const [storyLength, setStoryLength] = useState('Short');
  const [extendDetails, setExtendDetails] = useState(false);
  const [genre, setGenre] = useState<string | null>(null);
  const [characters, setCharacters] = useState('');
  const [setting, setSetting] = useState('');
  const [loading, setLoading] = useState(false);
  const [narrative, setNarrative] = useState('FIRST_PERSON');
  const [loadingAds, setLoadingAds] = useState<boolean>(false);
  const [loadingSuggestIdea, setLoadingSuggestIdea] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const isButtonDisabled = !storyIdea || loading;
  const interstitial = useRef<InterstitialAd | null>(null);
  const threadId = useRef<string>('');

  const navigateToThreadDetail = useCallback(() => {
    if (!threadId.current) {
      showErrorToast('Something went wrong!!! Please try again.');
      return;
    }
    navigation.navigate('ThreadDetail', {
      threadId: threadId.current,
      isCreate: true,
    });
    threadId.current = '';
  }, [navigation]);

  const onPressGenerate = useCallback(async () => {
    const payload = {
      title: storyIdea,
      storyIdea,
      isCanInteract: STORY_TYPE.find((s) => s.key === storyType)
        ?.value as number,
      storyLength: storyLength.toLocaleUpperCase(),
      genreType: genre,
      characterPrompt: characters,
      settingPrompt: setting,
      narrative: NARRATIVE.find((n) => n.value === narrative)?.value,
    };

    if (userProfile?.isVip) {
      try {
        const response = await createThread(payload);
        if (response.data && response.data.id) {
          threadId.current = response.data.threadId;
          navigateToThreadDetail();
        }
      } catch (error) {
        showErrorToast(
          (error as string) ?? 'Something went wrong!!! Please try again.'
        );
      } finally {
        setLoading(false);
      }

      return;
    } else {
      // case show ads with normal user
      interstitial.current?.load();
      setLoadingAds(true);
      try {
        const response = await createThread(payload);
        if (response.data && response.data.id) {
          threadId.current = response.data.threadId;
          await Promise.resolve(setTimeout(() => {}, 3000));
          if (!loadingAds) {
            interstitial.current?.show();
          } else {
            navigateToThreadDetail();
          }
        }
      } catch (error) {
        showErrorToast(
          (error as string) ?? 'Something went wrong!!! Please try again.'
        );
      } finally {
        setLoading(false);
      }
    }
  }, [
    storyIdea,
    storyLength,
    genre,
    characters,
    setting,
    userProfile?.isVip,
    storyType,
    narrative,
    loadingAds,
    navigateToThreadDetail,
  ]);

  const onPressSuggestIdea = useCallback(async () => {
    setLoadingSuggestIdea(true);
    const response = await generateIdea();
    if (response.status === 200 && response.data?.idea) {
      setStoryIdea(response.data?.idea);
    } else {
      showErrorToast(
        (response.data as unknown as string) ??
          'Something went wrong!!! Please try again.'
      );
    }
    setLoadingSuggestIdea(false);
  }, []);

  useEffect(() => {
    interstitial.current = InterstitialAd.createForAdRequest(
      ADMOB_ADS.CREATE_STORY_INTERSTITIAL,
      {
        requestNonPersonalizedAdsOnly: true,
      }
    );

    if (!interstitial.current) return;
    // Event listener for when the ad is loaded
    const unsubscribeLoaded = interstitial.current.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('Interstitial ad loaded');
        setLoadingAds(false);
      }
    );

    // Event listener for when the ad is closed
    const unsubscribeClosed = interstitial.current.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('Interstitial ad closed');
        navigateToThreadDetail();
      }
    );

    // Event listener for when the ad fails to load
    const unsubscribeError = interstitial.current.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        console.error('Interstitial ad failed to load:', error);
        interstitial.current?.load();
      }
    );

    // Clean up event listeners when component unmounts
    return () => {
      if (interstitial.current) {
        unsubscribeLoaded();
        unsubscribeError();
        unsubscribeClosed();
        interstitial.current.removeAllListeners();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {/* Story prompt */}
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

        {/* Story size */}
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

        {/* More details (optional) */}
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
              {GENRES.map((g) => (
                <Pressable
                  key={g.key}
                  style={[
                    styles.genreItem,
                    genre === g.key && styles.genreItemActive,
                  ]}
                  onPress={() => setGenre(g.key)}
                >
                  <View style={styles.genreImagePlaceholder} />
                  <TextApp style={styles.genreText}>{g.label}</TextApp>
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
              style={styles.textInput}
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
                  <View style={styles.genreImagePlaceholder} />
                  <TextApp style={styles.genreText}>{n.label}</TextApp>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Start generate button */}
        <Pressable
          style={[
            styles.generateButton,
            isButtonDisabled && styles.generateButtonDisabled,
          ]}
          disabled={isButtonDisabled}
          onPress={onPressGenerate}
        >
          <TextApp style={styles.generateButtonText}>
            {loading || loadingAds ? 'Generating...' : 'Start generate'}
          </TextApp>
        </Pressable>
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
  genreImagePlaceholder: {
    width: 60,
    height: 40,
    backgroundColor: '#555',
    borderRadius: 6,
    marginBottom: 4,
  },
  genreText: {
    fontSize: 13,
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
    backgroundColor: '#444',
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  iconSuggestion: { marginRight: 8 },
});
