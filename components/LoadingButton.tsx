import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  TextStyle,
  ViewStyle,
} from 'react-native';
import TextApp from './TextApp';

interface LoadingButtonProps {
  loading?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  iconSize?: number;
  iconColor?: string;
  loadingColor?: string;
  disabled?: boolean;
  textStyle?: StyleProp<TextStyle>;
}

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  loading = false,
  icon,
  text,
  onPress,
  style,
  iconSize = 14,
  iconColor = '#fff',
  loadingColor = '#fff',
  disabled = false,
  textStyle,
}) => {
  return (
    <Pressable
      style={style}
      onPress={onPress}
      disabled={loading || disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loadingColor} />
      ) : (
        <Ionicons name={icon} size={iconSize} color={iconColor} />
      )}
      <TextApp style={textStyle}>{text}</TextApp>
    </Pressable>
  );
};

