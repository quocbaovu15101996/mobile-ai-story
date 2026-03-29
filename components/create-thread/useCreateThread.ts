import { ADMOB_ADS } from '@/config/admob-config';
import { analyticsService } from '@/src/services/analyticsService';
import { createThread, generateIdea } from '@/src/services/api/thread';
import { useFetchGenres, useGenres, useUserProfile } from '@/src/store';
import { showErrorToast } from '@/src/utils/toast';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { RootStackParamList } from '../../app/_layout';

export const STORY_TYPE = [
  { key: 'endless', label: 'Endless', subLabel: 'Step-by-step', value: 1 },
  { key: 'story', label: 'Story', subLabel: 'Full story', value: 0 },
];

export const STORY_LENGTH = ['Short', 'Medium', 'Long'];

export const NARRATIVE = [
  {
    value: 'FIRST_PERSON',
    label: 'First person',
    image: '415ef3f0-782a-4b15-bd93-69f996a6e5a5'
  },
  {
    value: 'THIRD_PERSON',
    label: 'Third person',
    image: '77376ef1-3102-48ef-abe6-aa6ca9fb7197'
  },
];

export const useCreateThread = () => {
  const userProfile = useUserProfile();
  const genres = useGenres();
  const fetchGenres = useFetchGenres();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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

  const interstitial = useRef<InterstitialAd | null>(null);
  const threadId = useRef<string>('');
  const isInterstitialLoaded = useRef(false);

  const isButtonDisabled = !storyIdea || loading;

  const resetCreateStoryForm = useCallback(() => {
    setStoryIdea('');
    setStoryType('endless');
    setStoryLength('Short');
    setExtendDetails(false);
    setGenre(null);
    setCharacters('');
    setSetting('');
    setNarrative('FIRST_PERSON');
  }, []);

  const isEnoughDiamond = useCallback(() => {
    if (userProfile?.isVip) {
      return true;
    }
    return (userProfile?.diamond || 0) >= 3;
  }, [userProfile?.diamond, userProfile?.isVip]);

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
    if (!isEnoughDiamond()) {
      navigation.navigate('InAppPurchase');
      return;
    }
    setLoading(true);
    analyticsService.logStoryCreationStart();
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
          analyticsService.logStoryGenerated({
            storyType: storyType as 'endless' | 'story',
            storyLength: storyLength,
            genre: genre || undefined,
            hasCharacters: !!characters,
            hasSetting: !!setting,
            narrative: narrative,
            isVip: true,
          });
          resetCreateStoryForm();
          navigateToThreadDetail();
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong!!! Please try again.';
        setLoadingAds(false);
        showErrorToast(errorMessage);
      } finally {
        setLoading(false);
      }

      return;
    } else {
      isInterstitialLoaded.current = false;
      interstitial.current?.load();
      setLoadingAds(true);
      try {
        const response = await createThread(payload);
        if (response.data && response.data.id) {
          threadId.current = response.data.threadId;
          analyticsService.logStoryGenerated({
            storyType: storyType as 'endless' | 'story',
            storyLength: storyLength,
            genre: genre || undefined,
            hasCharacters: !!characters,
            hasSetting: !!setting,
            narrative: narrative,
            isVip: false,
          });
          resetCreateStoryForm();
          // Wait up to 3 seconds for ad to load
          await new Promise((resolve) => setTimeout(resolve, 4000));
          if (isInterstitialLoaded.current && interstitial.current) {
            interstitial.current?.show();
          } else {
            navigateToThreadDetail();
          }
        }
      } catch (error: any) {
        const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong!!! Please try again.';
        showErrorToast(errorMessage);
      } finally {
        setLoading(false);
        setLoadingAds(false);
      }
    }
  }, [
    isEnoughDiamond,
    storyIdea,
    storyLength,
    genre,
    characters,
    setting,
    userProfile?.isVip,
    navigation,
    storyType,
    narrative,
    navigateToThreadDetail,
    resetCreateStoryForm,
  ]);

  const onPressSuggestIdea = useCallback(async () => {
    analyticsService.logStoryIdeaSuggestion();
    setLoadingSuggestIdea(true);
    try {
      const response = await generateIdea();
      if (response.status === 200 && response.data?.idea) {
        setStoryIdea(response.data?.idea);
      } else {
        showErrorToast(
          (response.data as unknown as string) ??
          'Something went wrong!!! Please try again.'
        );
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Something went wrong!!! Please try again.';
      showErrorToast(errorMessage);
    } finally {
      setLoadingSuggestIdea(false);
    }
  }, []);

  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  useEffect(() => {
    interstitial.current = InterstitialAd.createForAdRequest(
      ADMOB_ADS.CREATE_STORY_INTERSTITIAL,
      {
        requestNonPersonalizedAdsOnly: true,
      }
    );

    if (!interstitial.current) return;

    const unsubscribeLoaded = interstitial.current.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isInterstitialLoaded.current = true;
        setLoadingAds(false);
      }
    );

    const unsubscribeOpened = interstitial.current.addAdEventListener(
      AdEventType.OPENED,
      () => {
        analyticsService.logInterstitialAdShown(
          ADMOB_ADS.CREATE_STORY_INTERSTITIAL
        );
      }
    );

    const unsubscribeClosed = interstitial.current.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        navigateToThreadDetail();
      }
    );

    const unsubscribeError = interstitial.current.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
        isInterstitialLoaded.current = false;
        setLoadingAds(false);
        analyticsService.logAdLoadError(
          'interstitial',
          error.message || 'Unknown error'
        );
      }
    );

    return () => {
      if (interstitial.current) {
        unsubscribeLoaded();
        unsubscribeOpened();
        unsubscribeError();
        unsubscribeClosed();
        interstitial.current.removeAllListeners();
      }
    };
  }, [navigateToThreadDetail]);

  return {
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
    resetCreateStoryForm,
  };
};
