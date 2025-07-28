import { Text, type TextProps } from 'react-native';
import { TEXT_COLOR } from '@/constants/color';

export interface TextAppProps extends TextProps {
  children: React.ReactNode;
}

export default function TextApp({ style, children, ...rest }: TextAppProps) {
  return (
    <Text
      style={[
        { color: TEXT_COLOR },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}