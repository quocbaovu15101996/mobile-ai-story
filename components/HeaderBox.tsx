import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import TextApp from './TextApp';

type Props = {
  title: string;
  diamond?: number;
  onPressToken: () => void;
  onPressCalendar: () => void;
};

const HeaderBox: React.FC<Props> = ({
  title,
  diamond,
  onPressToken,
  onPressCalendar,
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <TextApp style={styles.appName}>{title}</TextApp>
      <View style={styles.headerRight}>
        <Pressable
          style={({ pressed }) => [
            styles.tokenBox,
            pressed && { opacity: 0.7 },
          ]}
          onPress={onPressToken}
        >
          <Ionicons name="diamond" size={20} color="#7ee2ff" />
          <TextApp style={styles.tokenValue}>{diamond || 0}</TextApp>
        </Pressable>
        <Pressable style={styles.calendarIcon} onPress={onPressCalendar}>
          <Ionicons name="calendar-outline" size={24} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
};

export { HeaderBox };

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tokenBox: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginRight: 6,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenLabel: {
    fontSize: 12,
  },
  tokenValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7ee2ff',
  },
  calendarIcon: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
  notificationIcon: {
    padding: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  testButtonsContainer: {
    padding: 20,
    gap: 10,
  },
  testButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
