import { Ionicons } from '@expo/vector-icons';
import React, { FC } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import LoadingEllipsis from '../LoadingEllipsis';
import TextApp from '../TextApp';

type Props = {
  loading: boolean;
  loadingAds: boolean;
  isVip: boolean | undefined;
  isButtonDisabled: boolean;
  onPressGenerate: () => void;
};

const GenerateButton: FC<Props> = ({
  loading,
  loadingAds,
  isVip,
  isButtonDisabled,
  onPressGenerate,
}) => {
  return (
    <Pressable
      style={[
        styles.generateButton,
        isButtonDisabled && styles.generateButtonDisabled,
      ]}
      disabled={isButtonDisabled}
      onPress={onPressGenerate}
    >
      <View style={styles.generateButtonContent}>
        {loading || loadingAds ? (
          <LoadingEllipsis
            prefix="Generating"
            style={styles.generateButtonText}
          />
        ) : isVip ? (
          <TextApp style={styles.generateButtonText}>Start generate</TextApp>
        ) : (
          <>
            <TextApp style={styles.generateButtonText}>
              Start generate 3{' '}
            </TextApp>
            <Ionicons
              name="diamond"
              size={18}
              color="#7ee2ff"
              style={styles.diamondIcon}
            />
          </>
        )}
      </View>
    </Pressable>
  );
};

export default GenerateButton;

const styles = StyleSheet.create({
  generateButton: {
    backgroundColor: '#6366f1',
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  generateButtonDisabled: {
    backgroundColor: '#444',
  },
  generateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  generateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  diamondIcon: {
    marginHorizontal: 2,
  },
});
