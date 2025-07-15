import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function RollCallModal(props: Props) {
  const { visible, onClose } = props;
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(visible);
  }, [visible]);

  return (
    <>
      {show && <View style={styles.background} />}
      <Modal visible={show} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={onClose}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Check-In</Text>
              <View style={styles.modalGem}>
                <Ionicons name="diamond" size={20} color="#7ee2ff" />
                <Text style={styles.modalGemText}>28</Text>
              </View>
            </View>
            {/* Check-in days row */}
            <View style={styles.modalCheckinRow}>
              {[5, 6, 7, 8, 8, 8, 10].map((gem, idx) => (
                <View
                  key={idx}
                  style={[styles.modalCheckinDay, idx === 0 && styles.modalCheckinDayActive]}
                >
                  <Text style={styles.modalCheckinDayText}>Day {idx + 1}</Text>
                  <Ionicons name="diamond" size={18} color="#7ee2ff" style={{ marginTop: 4 }} />
                  <Text style={styles.modalCheckinDayGem}>{gem}</Text>
                  <Text style={{ color: '#aaa', fontSize: 10, marginTop: 2 }}>{idx === 0 ? 'Check-In' : 'Unopened'}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.modalCheckinBtn}>
              <Text style={styles.modalCheckinBtnText}>Check-In</Text>
            </TouchableOpacity>
            <View style={styles.modalAds}>
              <Text style={styles.modalAdsText}>Watch Ads (0/5)
                <Text style={{ color: '#7ee2ff' }}>  Watch ads to earn 1 Gems</Text>
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Ionicons name="diamond" size={18} color="#7ee2ff" />
                <Text style={styles.modalAdsGem}>+1</Text>
              </View>
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
    padding: 24,
    minHeight: 420,
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
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalGem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#2d2a4a',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  modalGemText: {
    color: '#7ee2ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalCheckinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  modalCheckinDay: {
    width: 60,
    height: 80,
    backgroundColor: '#2d2a4a',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  modalCheckinDayActive: {
    borderWidth: 2,
    borderColor: '#7ee2ff',
  },
  modalCheckinDayText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalCheckinDayGem: {
    color: '#7ee2ff',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 4,
  },
  modalCheckinBtn: {
    marginTop: 32,
    backgroundColor: '#7ee2ff',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCheckinBtnText: {
    color: '#232136',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalAds: {
    marginTop: 24,
    backgroundColor: '#2d2a4a',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalAdsText: {
    color: '#fff',
    fontSize: 15,
  },
  modalAdsGem: {
    color: '#7ee2ff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
