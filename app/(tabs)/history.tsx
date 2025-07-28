import TextApp from '@/components/TextApp';
import { ThreadItem } from '@/components/ThreadItem';
import { getHistory } from '@/src/services/api/thread';
import { Thread } from '@/src/services/api/types';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  RefreshControl,
  StyleSheet,
  View
} from 'react-native';

const PAGE_SIZE = 10;

export default function HistoryScreen() {
  const { colors } = useTheme();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  const fetchHistory = async (isRefresh = false, page = 0) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else if (page === 0) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const response = await getHistory(page, PAGE_SIZE);
      const newThreads = response.data.threads || [];

      if (page === 0) {
        // First page or refresh - replace all threads
        setThreads(newThreads);
        setCurrentPage(0);
      } else {
        // Load more - append to existing threads
        setThreads(prevThreads => [...prevThreads, ...newThreads]);
        setCurrentPage(page);
      }

      setHasNext(response.data.hasNext);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Failed to load history. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    fetchHistory(true, 0);
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasNext) {
      fetchHistory(false, currentPage + 1);
    }
  };

  const renderItem: ListRenderItem<Thread> = ({ item }) => (
    <ThreadItem thread={item} />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <TextApp style={styles.emptyText}>No stories yet</TextApp>
      <TextApp style={styles.emptySubText}>
        Start creating your AI stories to see them here
      </TextApp>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.loadMoreContainer}>
        <ActivityIndicator size="small" color="#007AFF" />
        <TextApp style={styles.loadMoreText}>Loading more stories...</TextApp>
      </View>
    );
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <TextApp style={styles.errorText}>{error}</TextApp>
    </View>
  );

  const keyExtractor = (item: Thread) => item.id;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <TextApp style={styles.loadingText}>Loading your stories...</TextApp>
      </View>
    );
  }

  if (error) {
    return renderError();
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={threads}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    lineHeight: 24,
  },
  loadMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  loadMoreText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666666',
  },
});
