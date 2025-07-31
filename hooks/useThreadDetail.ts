import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect, useCallback } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../app/_layout';
import { MESSAGE_TYPE, ROLE } from '../constants';
import { Thread, MessageItemInterface } from '../src/services/api/types';
import {
  continueThread,
  createARunThread,
  expandThread,
  getThreadDetail,
  getThreadMessages,
} from '../src/services/api/thread';

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
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPassage, setLoadingPassage] = useState(false);
  const [passages, setPassages] = useState<MessageItemInterface[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ThreadDetailScreenRouteProp>();
  const { threadId, isCreate } = route.params;

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

  const onDeleteMessage = useCallback(() => {
    // Implementation for delete message
  }, []);

  const onRewriteMessage = useCallback(() => {
    // Implementation for rewrite message
  }, []);

  const onContinue = useCallback(async () => {
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
    setLoadingPassage(false);
  }, [threadId, createTempMessage]);

  const onExpand = useCallback(async () => {
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
    setLoadingPassage(false);
  }, [threadId, createTempMessage]);

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