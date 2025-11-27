import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ActionModal from '@/components/ActionModal';

import { DiamondBox } from '@/components/DiamondBox';
import ExtendModal from '@/components/ExtendModal';
import TextApp from '@/components/TextApp';
import { ThemedView } from '@/components/ThemedView';
import { MessageItem } from '@/components/thread/MessageItem';
import { ThreadBottomAction } from '@/components/thread/ThreadBottomAction';
import { useThreadDetail } from '@/hooks/useThreadDetail';
import { analyticsService } from '@/src/services/analyticsService';
import { SCREEN_HEIGHT } from '@/src/utils';

export default function ThreadDetail() {
  const { colors } = useTheme();

  const {
    thread,
    loading,
    loadingPassage,
    passages,
    error,
    diamond,
    isExtendModalVisible,
    actionModalVisible,
    actionModalPosition,
    showDeleteConfirm,
    handleGoBack,
    onDeleteMessage,
    onRewriteMessage,
    onContinue,
    onExpand,
    loadThreadDetail,
    onPressDiamond,
    onExtendWithContent,
    onCloseExtendModal,
    handleActionPress,
    handleActionOption,
    handleDeleteConfirm,
    handleCloseDeleteConfirm,
    handleCloseActionModal,
  } = useThreadDetail();

  useEffect(() => {
    if (thread?.threadId) {
      analyticsService.logScreenView('ThreadDetail');
      analyticsService.logThreadViewed(thread.threadId, false);
    }
  }, [thread?.threadId]);

  const actionButtonRef = useRef<View>(null);

  const onActionPress = () => {
    if (actionButtonRef.current) {
      actionButtonRef.current.measureInWindow((x, y) => {
        handleActionPress(y);
      });
    }
  };

  const renderThreadHeader = () => {
    return (
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={handleGoBack}>
          <Ionicons name="close" size={24} color={colors.text} />
        </Pressable>
        <View style={styles.headerRight}>
          <DiamondBox onPress={onPressDiamond} diamond={diamond} />
          <View ref={actionButtonRef} collapsable={false}>
            <Pressable onPress={onActionPress} testID="action-button">
              <Ionicons
                name="ellipsis-vertical"
                size={24}
                color={colors.text}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  const renderItem: ListRenderItem<MessageItemInterface> = React.useCallback(
    ({ item }) => <MessageItem item={item} />,
    []
  );

  const keyExtractor = React.useCallback(
    (item: MessageItemInterface, index: number) => `${item.id}-${index}`,
    []
  );

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

      <TextApp style={styles.storyTitle}>{thread?.title}</TextApp>
    </View>
  );

  const renderFooter = () => {
    if (loadingPassage) {
      return <ActivityIndicator size="small" color="#007AFF" />;
    }
    return (
      thread?.isCanInteract === 1 && (
        <View style={styles.messageActions}>
          <Pressable style={styles.actionButtonSmall} onPress={onDeleteMessage}>
            <Ionicons name="trash" size={14} color="#fff" />
            <TextApp style={styles.actionButtonText}>Delete</TextApp>
          </Pressable>
          <Pressable
            style={styles.actionButtonSmall}
            onPress={onRewriteMessage}
          >
            <Ionicons name="refresh-sharp" size={14} color="#fff" />
            <TextApp style={styles.actionButtonText}>Re-Write</TextApp>
          </Pressable>
        </View>
      )
    );
  };

  React.useEffect(() => {
    if (showDeleteConfirm) {
      Alert.alert(
        'Delete Thread',
        'Are you sure you want to delete this thread? This action cannot be undone.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: handleCloseDeleteConfirm,
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: handleDeleteConfirm,
          },
        ]
      );
    }
  }, [handleCloseDeleteConfirm, handleDeleteConfirm, showDeleteConfirm]);

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
      {renderThreadHeader()}
      <FlatList
        data={passages}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        style={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatListContent}
        removeClippedSubviews
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={50}
      />

      <ThreadBottomAction
        visible={!loadingPassage && thread?.isCanInteract === 1}
        onContinue={onContinue}
        onExpand={onExpand}
      />

      <ExtendModal
        visible={isExtendModalVisible}
        onClose={onCloseExtendModal}
        onExtend={onExtendWithContent}
        loading={loadingPassage}
      />
      {actionModalVisible && (
        <ActionModal
          visible={actionModalVisible}
          positionY={actionModalPosition}
          onClose={handleCloseActionModal}
          onSelectOption={handleActionOption}
        />
      )}
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
    marginLeft: 4,
  },
  flatListContainer: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: SCREEN_HEIGHT / 3,
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
  storyTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingHorizontal: 16,
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
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 50,
    gap: 8,
  },
  messageActions: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    marginRight: 12,
  },
});
