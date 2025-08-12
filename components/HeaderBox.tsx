import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import CrownIcon from '../assets/icons/icon-crown.svg';
import { DiamondBox } from './DiamondBox';
import TextApp from './TextApp';

type Props = {
  title: string;
  diamond?: number;
  isVip?: boolean;
  onPressToken: () => void;
  onPressCalendar: () => void;
};

const HeaderBox: React.FC<Props> = ({
  title,
  diamond,
  isVip,
  onPressToken,
  onPressCalendar,
}) => {
  const { colors } = useTheme();
  return (
    <View style={styles.header}>
      <TextApp style={styles.appName}>{title}</TextApp>

      {isVip ? (
        <View style={styles.vipBadge}>
          <CrownIcon width={24} height={24} fill={colors.text} />
        </View>
      ) : (
        <View style={styles.headerRight}>
          <DiamondBox onPress={onPressToken} diamond={diamond} />
          <Pressable style={styles.calendarIcon} onPress={onPressCalendar}>
            <Ionicons name="calendar-outline" size={24} color={colors.text} />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export { HeaderBox };

const styles = StyleSheet.create({
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
  calendarIcon: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#1a1a1a',
  },
  vipBadge: {
    marginRight: 8,
  },
});
