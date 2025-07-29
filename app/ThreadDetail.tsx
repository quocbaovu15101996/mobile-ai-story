import TextApp from '@/components/TextApp';
import { ThemedView } from '@/components/ThemedView';
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
  Image,
  ListRenderItem,
  SafeAreaView,
  StyleSheet,
  Pressable,
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
  const [passages, setPassages] = useState<MessageItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ThreadDetailScreenRouteProp>();
  const { threadId, isCreate } = route.params;

  const runThread = async () => {
    try {
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
    <ThemedView style={styles.messageContainer}>
      <TextApp style={styles.storyText}>
        {item.content.text.value}
      </TextApp>
    </ThemedView>
  );

  const keyExtractor = (item: MessageItem, index: number) => `${item.id}-${index}`;

  const renderHeader = () => (
    <ThemedView>
      {/* Hero Image */}
      {thread?.image && (
        <View style={styles.heroImageContainer}>
          <Image
            source={{ uri: thread.image }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Story Title */}
      <ThemedView style={styles.titleContainer}>
        <TextApp style={styles.storyTitle}>{thread?.title}</TextApp>
      </ThemedView>
    </ThemedView>
  );



  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.header, { backgroundColor: colors.background }]}>
            <Pressable style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
            <View style={styles.headerRight}>
              <Pressable style={styles.actionButton}>
                <Ionicons name="refresh" size={24} color={colors.text} />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
              </Pressable>
            </View>
          </View>
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <TextApp style={styles.loadingText}>Loading thread details...</TextApp>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (error || !thread) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={[styles.header, { backgroundColor: colors.background }]}>
            <Pressable style={styles.backButton} onPress={handleGoBack}>
              <Ionicons name="close" size={24} color={colors.text} />
            </Pressable>
            <View style={styles.headerRight}>
              <Pressable style={styles.actionButton}>
                <Ionicons name="refresh" size={24} color={colors.text} />
              </Pressable>
              <Pressable style={styles.actionButton}>
                <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
              </Pressable>
            </View>
          </View>
          <ThemedView style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <TextApp style={styles.errorText}>{error || 'Thread not found'}</TextApp>
            <Pressable
              style={styles.retryButton}
              onPress={loadThreadDetail}
            >
              <TextApp style={styles.retryButtonText}>Retry</TextApp>
            </Pressable>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <Pressable style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="close" size={24} color={colors.text} />
          </Pressable>
          <View style={styles.headerRight}>
            <Pressable style={styles.actionButton}>
              <Ionicons name="refresh" size={24} color={colors.text} />
            </Pressable>
            <Pressable style={styles.actionButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <FlatList
          data={passages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListHeaderComponent={renderHeader}
          style={styles.flatListContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
        />

        {/* Bottom Actions */}
        <ThemedView style={styles.bottomActions}>
          <Pressable style={[styles.actionButtonLarge, styles.continueButton]}>
            <Ionicons name="play" size={20} color="#fff" />
            <TextApp style={styles.actionButtonText}>Continue</TextApp>
          </Pressable>
          <Pressable style={[styles.actionButtonLarge, styles.expandButton]}>
            <Ionicons name="expand" size={20} color="#fff" />
            <TextApp style={styles.actionButtonText}>Expand</TextApp>
          </Pressable>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    zIndex: 1000,
  },
  backButton: {
    padding: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  flatListContainer: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  },
  heroImageContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  messageContainer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  contentContainer: {
    padding: 24,
    flex: 1,
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 34,
  },
  storyText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 12,
  },
  actionButtonLarge: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 50,
    gap: 8,
  },
  continueButton: {
    backgroundColor: '#000',
  },
  expandButton: {
    backgroundColor: '#000',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
});
