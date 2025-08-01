import TextApp from '@/components/TextApp';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';

type ThreadBottomActionProps = {
  visible: boolean;
  onContinue: () => void;
  onExpand: () => void;
  style?: ViewStyle;
};

export const ThreadBottomAction: React.FC<ThreadBottomActionProps> = ({
  visible,
  onContinue,
  onExpand,
  style,
}) => {
  const translateY = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.spring(translateY, {
      toValue: visible ? 0 : 100,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start();
  }, [visible, translateY]);

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          transform: [{ translateY }],
          opacity: translateY.interpolate({
            inputRange: [0, 100],
            outputRange: [1, 0],
          }),
        },
      ]}
    >
      <ThemedView style={styles.actionsContainer}>
        <Pressable
          style={[styles.actionButton, styles.continueButton]}
          onPress={onContinue}
          disabled={!visible}
        >
          <Ionicons name="play" size={24} color="#fff" />
          <TextApp style={styles.actionButtonText}>Continue</TextApp>
        </Pressable>
        <Pressable
          style={[styles.actionButton, styles.expandButton]}
          onPress={onExpand}
          disabled={!visible}
        >
          <Ionicons name="expand" size={24} color="#fff" />
          <TextApp style={styles.actionButtonText}>Expand</TextApp>
        </Pressable>
      </ThemedView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    paddingBottom: 32,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 8,
  },
  continueButton: {
    backgroundColor: '#6366f1',
  },
  expandButton: {
    backgroundColor: '#4b5563',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
