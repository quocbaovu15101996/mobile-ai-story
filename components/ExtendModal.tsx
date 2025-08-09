import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onExtend: (content: string, tone: string) => void;
  loading?: boolean;
};

const TONE_OPTIONS = [
  { key: 'DEFAULT', label: 'Default', icon: 'library-outline' },
  { key: 'CHARACTER', label: 'Character', icon: 'person-outline' },
  { key: 'SPICY', label: 'Spicy', icon: 'flame-outline' },
  { key: 'EMOTION', label: 'Emotion', icon: 'heart-outline' },
  { key: 'DARK', label: 'Dark', icon: 'moon-outline' },
  { key: 'COMEDY', label: 'Comedy', icon: 'happy-outline' },
  { key: 'CLASH', label: 'Clash', icon: 'flash-outline' },
];

export default function ExtendModal({ visible, onClose, onExtend, loading = false }: Props) {
  const [content, setContent] = useState('');
  const [selectedTone, setSelectedTone] = useState('DEFAULT');

  const handleExtend = () => {
    if (content.trim() && !loading) {
      onExtend(content.trim(), selectedTone);
      setContent('');
      setSelectedTone('DEFAULT');
      onClose();
    }
  };

  const handleClose = () => {
    setContent('');
    setSelectedTone('DEFAULT');
    onClose();
  };

  return (
    <>
      {visible && <View style={styles.background} />}
      <Modal visible={visible} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={handleClose}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Extend Story</Text>
              <Pressable onPress={handleClose} style={styles.closeButton} testID="close-button">
                <Ionicons name="close" size={24} color="#fff" />
              </Pressable>
            </View>

            {/* Content Input */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>What should happen next?</Text>
              <TextInput
                style={styles.textInput}
                value={content}
                onChangeText={setContent}
                placeholder="Enter your story direction..."
                placeholderTextColor="#999"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                testID="content-input"
              />
            </View>

            {/* Tone Selection */}
            <View style={styles.toneSection}>
              <Text style={styles.inputLabel}>Select Tone</Text>
              <View style={styles.toneGrid}>
                {TONE_OPTIONS.map((tone) => (
                  <Pressable
                    key={tone.key}
                    style={[
                      styles.toneOption,
                      selectedTone === tone.key && styles.toneOptionSelected,
                    ]}
                    onPress={() => setSelectedTone(tone.key)}
                  >
                    <Ionicons
                      name={tone.icon as any}
                      size={20}
                      color={selectedTone === tone.key ? '#232136' : '#7ee2ff'}
                    />
                    <Text
                      style={[
                        styles.toneOptionText,
                        selectedTone === tone.key && styles.toneOptionTextSelected,
                      ]}
                    >
                      {tone.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionSection}>
              <Pressable
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleClose}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.actionButton,
                  styles.extendButton,
                  (!content.trim() || loading) && styles.extendButtonDisabled,
                ]}
                onPress={handleExtend}
                disabled={!content.trim() || loading}
              >
                <Text style={styles.extendButtonText}>
                  {loading ? 'Extending...' : 'Extend Story'}
                </Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#232136',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 480,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: '#2d2a4a',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 16,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#3d3a5a',
  },
  toneSection: {
    marginBottom: 24,
  },
  toneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2a4a',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#3d3a5a',
  },
  toneOptionSelected: {
    backgroundColor: '#7ee2ff',
    borderColor: '#7ee2ff',
  },
  toneOptionText: {
    color: '#7ee2ff',
    fontSize: 14,
    fontWeight: '500',
  },
  toneOptionTextSelected: {
    color: '#232136',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#4a5568',
  },
  extendButton: {
    backgroundColor: '#7ee2ff',
  },
  extendButtonDisabled: {
    backgroundColor: '#4a5568',
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  extendButtonText: {
    color: '#232136',
    fontSize: 16,
    fontWeight: '600',
  },
});