import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { ActivityIndicator, FlatList, Image, ListRenderItem, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import TextApp from '@/components/TextApp';
import { ThemedView } from '@/components/ThemedView';
import { MessageItem } from '@/components/thread/MessageItem';
import { useThreadDetail } from '@/hooks/useThreadDetail';

import type { MessageItemInterface } from '@/src/services/api/types';
import { SCREEN_HEIGHT } from '@/src/utils';

export default function ThreadDetail() {
  const { colors } = useTheme();

  const {
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
  } = useThreadDetail();

  const renderThreadHeader = () => {
    return (
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerRight}>
          <Pressable style={styles.actionButton}>
            <Ionicons name="refresh" size={24} color={colors.text} />
          </Pressable>
          <Pressable style={styles.actionButton}>
            <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
          </Pressable>
        </View>
      </View>
    );
  };

  const renderItem: ListRenderItem<MessageItemInterface> = React.useCallback(({ item }) => (
    <MessageItem item={item} />
  ), []);

  const keyExtractor = React.useCallback((item: MessageItemInterface, index: number) =>
    `${item.id}-${index}`, []);

  const renderHeader = () => (
    <View>
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
    </View>
  );

  const renderActions = () => (
    <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'flex-end', marginRight: 12 }}>
      <Pressable style={styles.actionButtonSmall} onPress={onDeleteMessage}>
        <Ionicons name="trash" size={14} color="#fff" />
        <TextApp style={styles.actionButtonText}>Delete</TextApp>
      </Pressable>
      <Pressable style={styles.actionButtonSmall} onPress={onRewriteMessage}>
        <Ionicons name="refresh-sharp" size={14} color="#fff" />
        <TextApp style={styles.actionButtonText}>Re-Write</TextApp>
      </Pressable>
    </View>
  );

  const renderFooter = () => {
    if (loadingPassage) {
      return (
        <ActivityIndicator size="small" color="#007AFF" />
      )
    }
    return thread?.isCanInteract === 1 && renderActions()
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {renderThreadHeader()}
          <ThemedView style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <TextApp style={styles.loadingText}>
              Loading thread details...
            </TextApp>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (error || !thread) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          {renderThreadHeader()}
          <ThemedView style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
            <TextApp style={styles.errorText}>
              {error || 'Thread not found'}
            </TextApp>
            <Pressable style={styles.retryButton} onPress={loadThreadDetail}>
              <TextApp style={styles.retryButtonText}>Retry</TextApp>
            </Pressable>
          </ThemedView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      {renderThreadHeader()}

      {/* Content */}
      <FlatList
        data={passages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        style={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
      />

      {/* Bottom Actions */}
      <ThemedView style={styles.bottomActions}>
        <Pressable
          style={[styles.actionButtonLarge, styles.continueButton]}
          onPress={onContinue}
        >
          <Ionicons name="play" size={24} color="#fff" />
          <TextApp style={styles.actionButtonText}>Continue</TextApp>
        </Pressable>
        <Pressable
          style={[styles.actionButtonLarge, styles.expandButton]}
          onPress={onExpand}
        >
          <Ionicons name="expand" size={24} color="#fff" />
          <TextApp style={styles.actionButtonText}>Expand</TextApp>
        </Pressable>
      </ThemedView>
    </SafeAreaView>
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
    gap: 12,
    paddingBottom: SCREEN_HEIGHT / 3
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
  actionButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'gray',
    padding: 8,
    borderRadius: 50,
    gap: 8,
  }
});
