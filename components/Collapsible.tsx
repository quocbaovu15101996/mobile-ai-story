import { PropsWithChildren, useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useGetThemeColor } from '@/hooks/useThemeColor';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const themeColors = useGetThemeColor('dark');

  return (
    <ThemedView>
      <Pressable
        style={({pressed}) => [styles.heading, pressed && { opacity: 0.8 }]}
        onPress={() => setIsOpen((value) => !value)}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={themeColors.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </Pressable>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});
