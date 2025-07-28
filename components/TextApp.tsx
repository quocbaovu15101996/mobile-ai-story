import { Text, type TextProps } from 'react-native';
export interface TextAppProps extends TextProps {
  children: React.ReactNode;
}

export default function TextApp({ style, children, ...rest }: TextAppProps) {
  return (
    <Text
      style={[
        { color: 'rgb(241,241,241)' },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
}