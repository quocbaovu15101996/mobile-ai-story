import { useTheme } from '@react-navigation/native';
import { Text, type TextProps } from 'react-native';
export interface TextAppProps extends TextProps {
  children: React.ReactNode;
}

export default function TextApp({ style, children, ...rest }: TextAppProps) {
  const { colors } = useTheme();

  return (
    <Text
      style={[
        { color: colors.text },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}