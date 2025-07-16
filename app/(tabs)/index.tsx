
import CreateThreadBox from '@/components/CreateThreadBox';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RollCallModal from '../../components/RollCallModal';


export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appName}>AI Story</Text>
        <View style={styles.headerRight}>
          <View style={styles.tokenBox}>
            <Text style={styles.tokenLabel}>Total Token</Text>
            <Text style={styles.tokenValue}>1234</Text>
          </View>
          <TouchableOpacity style={styles.calendarIcon} onPress={() => setModalVisible(true)}>
            <Ionicons name="calendar-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      <CreateThreadBox />
      <RollCallModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222',
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenBox: {
    flexDirection: 'row',
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  tokenLabel: {
    fontSize: 12,
    color: '#555',
  },
  tokenValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  calendarIcon: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#e5e7eb',
  },
});
