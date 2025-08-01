import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { RootStackParamList } from '../app/_layout';
import { MESSAGE_TYPE, ROLE } from '../constants';
import {
  continueThread,
  createARunThread,
  eraseLastMessage,
  expandThread,
  getThreadDetail,
  getThreadMessages,
  rewriteLastMessage,
} from '../src/services/api/thread';
import { MessageItemInterface, Thread } from '../src/services/api/types';
import { getUserProfile } from '../src/services/api/users';
import { useAuthActions } from '../src/store/useAuthStore';

type ThreadDetailScreenRouteProp = {
  key: string;
  name: string;
  params: {
    threadId: string;
    isCreate: boolean;
  };
};

const TONE_TYPE = {
  DEFAULT: 'DEFAULT',
  CHARACTER: 'CHARACTER',
  SPICY: 'SPICY',
  EMOTION: 'EMOTION',
  DARK: 'DARK',
  COMEDY: 'COMEDY',
  CLASH: 'CLASH',
};

export const useThreadDetail = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ThreadDetailScreenRouteProp>();
  const { threadId, isCreate } = route.params;
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPassage, setLoadingPassage] = useState(isCreate);
  const [deleting, setDeleting] = useState(false);
  const [passages, setPassages] = useState<MessageItemInterface[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { setUserProfile } = useAuthActions();

  const updateUserProfile = useCallback(async () => {
    try {
      const profileResponse = await getUserProfile();
      if (profileResponse.data) {
        setUserProfile(profileResponse.data);
      }
    } catch (profileError) {
      console.error('Failed to fetch user profile:', profileError);
      // Don't throw error as this shouldn't break the main flow
    }
  }, [setUserProfile]);


  const createTempMessage = useCallback((
    messageId: string,
    content: string,
    type: string,
    role: string
  ): MessageItemInterface => {
    return {
      id: messageId,
      object: '',
      created_at: '',
      thread_id: '',
      run_id: '',
      role: role,
      content: {
        type: type,
        text: {
          value: content,
        },
      },
      metadata: {
        type: type,
        content: content,
      },
    };
  }, []);

  const runThread = useCallback(async () => {
    try {
      const response = await createARunThread(threadId);
      const newMessage = createTempMessage(
        response.data.id,
        response.data.content,
        'text',
        'assistant'
      );
      setPassages([newMessage]);
    } catch (err) {
      console.error('Error loading thread detail:', err);
    } finally {
      setLoadingPassage(false);
    }
  }, [threadId, createTempMessage]);

  const loadThreadDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await Promise.all([
        getThreadDetail(threadId),
        getThreadMessages(threadId),
      ]);
      const [threadDetail, threadMessages] = response;
      setThread(threadDetail.data);
      setPassages(threadMessages.data);
    } catch (err) {
      setError('Failed to load thread details');
      console.error('Error loading thread detail:', err);
    } finally {
      setLoading(false);
    }
  }, [threadId]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onDeleteMessage = useCallback(async () => {
    if (passages.length < 2 || deleting) return;

    try {
      setDeleting(true);
      const response = await eraseLastMessage(threadId);
      if (response.status === 200 && response.data === true) {
        setPassages(prevPassages => prevPassages.slice(0, -2));
      }
    } catch (err) {
      console.error('Error deleting messages:', err);
      setError('Failed to delete messages');
    } finally {
      setDeleting(false);
    }
  }, [threadId, passages.length, deleting]);

  const onRewriteMessage = useCallback(async () => {
    try {
      setLoadingPassage(true);
      setPassages(prevPassages => prevPassages.slice(0, -1));
      const response = await rewriteLastMessage(threadId);
      const newMessage = createTempMessage(
        response.data.id,
        response.data.content,
        MESSAGE_TYPE.TEXT,
        ROLE.ASSISTANT
      );
      setPassages((prevPassages) => [...prevPassages, newMessage]);
    } catch (err) {
      console.error('Error rewriting messages:', err);
      setError('Failed to rewrite messages');
    } finally {
      setLoadingPassage(false);
    }
  }, [threadId, createTempMessage]);

  const onContinue = useCallback(async () => {
    try {
      setLoadingPassage(true);
      const continueMessage = createTempMessage(
        '',
        '',
        MESSAGE_TYPE.CONTINUE,
        ROLE.USER
      );
      setPassages((prevPassages) => [...prevPassages, continueMessage]);
      const response = await continueThread(threadId);
      const newMessage = createTempMessage(
        response.data.id,
        response.data.content,
        MESSAGE_TYPE.TEXT,
        ROLE.ASSISTANT
      );
      setPassages((prevPassages) => [...prevPassages, newMessage]);
      
      // Update user profile after successful API call
      await updateUserProfile();
    } catch (err) {
      console.error('Error continuing messages:', err);
    } finally {
      setLoadingPassage(false);
    }
  }, [threadId, createTempMessage, updateUserProfile]);

  const onExpand = useCallback(async () => {
    try {
      setLoadingPassage(true);
      const payload = {
        content: 'we have some conflict',
        tone: TONE_TYPE.DEFAULT,
      };
      const expandMessage = createTempMessage(
        '',
        '',
        MESSAGE_TYPE.EXPAND,
        ROLE.USER
      );
      setPassages(prev => [...prev, expandMessage]);
      const response = await expandThread(threadId, payload);
      const newMessage = createTempMessage(
        response.data.id,
        response.data.content,
        MESSAGE_TYPE.TEXT,
        ROLE.ASSISTANT
      );
      setPassages(prev => [...prev, newMessage]);
      
      // Update user profile after successful API call
      await updateUserProfile();
    } catch (err) {
      console.error('Error expanding messages:', err);
    } finally {
      setLoadingPassage(false);
    }
  }, [threadId, createTempMessage, updateUserProfile]);



  useEffect(() => {
    loadThreadDetail();
  }, [loadThreadDetail]);

  useEffect(() => {
    if (isCreate) {
      runThread();
    }
  }, [isCreate, runThread]);

  return {
    thread,
    loading,
    loadingPassage,
    deleting,
    passages,
    error,
    handleGoBack,
    onDeleteMessage,
    onRewriteMessage,
    onContinue,
    onExpand,
    loadThreadDetail,
  };
};