import TextApp from '@/components/TextApp';
import { createARunThread, getThreadDetail, getThreadMessages } from '@/src/services/api/thread';
import { MessageItem, Thread } from '@/src/services/api/types';
import { Ionicons } from '@expo/vector-icons';
import {
  RouteProp,
  useNavigation,
  useRoute,
  useTheme,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { RootStackParamList } from './_layout';

type ThreadDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ThreadDetail'
>;

export default function ThreadDetail() {
  const { colors } = useTheme();

  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPassage, setLoadingPassage] = useState(false);
  const [passages, setPassages] = useState<MessageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ThreadDetailScreenRouteProp>();
  const { threadId, isCreate } = route.params;

  const runThread = async () => {
    try {
      setLoadingPassage(true);
      const response = await createARunThread(threadId);
      const newMessage: MessageItem = {
        id: response.data.id,
        object: '',
        created_at: '',
        thread_id: '',
        run_id: '',
        role: 'assistant',
        content: {
          type: 'text',
          text: {
            value: response.data.content,
          },
        },
        metadata: {
          type: 'text',
          content: response.data.content,
        },
      };
      setPassages([newMessage]);
    } catch (err) {
      console.error('Error loading thread detail:', err);
    } finally {
      setLoadingPassage(false);
    }
  };

  const loadThreadDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = Promise.all([getThreadDetail(threadId), getThreadMessages(threadId)]);
      const [threadDetail, threadMessages] = await response;
      setThread(threadDetail.data);
      setPassages(threadMessages.data);
    } catch (err) {
      setError('Failed to load thread details');
      console.error('Error loading thread detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    loadThreadDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isCreate) {
      runThread();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCreate]);

  const renderItem: ListRenderItem<MessageItem> = ({ item }) => (
    <View style={styles.messageContainer}>
      <TextApp>{item.content.text.value}</TextApp>
    </View>
  );

  const keyExtractor = (item: MessageItem, index: number) => item.id + index.toString();

  const renderHeader = () => (
    <View style={styles.threadContainer}>
      <TextApp style={styles.threadTitle}>{thread?.title}</TextApp>
      <TextApp style={styles.threadDate}>{thread?.createdDate}</TextApp>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thread Detail</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Loading thread details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !thread) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thread Detail</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error || 'Thread not found'}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={loadThreadDetail}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <TextApp style={styles.headerTitle}>Thread Detail</TextApp>
        <View style={styles.headerRightPlaceholder} />
      </View>

      <FlatList
        data={passages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  headerRightPlaceholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  threadContainer: {
    padding: 20,
  },
  threadTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
  },
  threadDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  contentSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  contextSection: {
    marginBottom: 24,
  },
  contextItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  contextItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contextItemIndex: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    minWidth: 24,
    textAlign: 'center',
  },
  contextItemText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  messageContainer: {

  }
});
