
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7fa' }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {/* Upgrade Premium */}
        <View style={styles.premiumCard}>
          <Text style={styles.premiumTitle}>Upgrade Premium</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <Text style={styles.premiumFeature}>  Unlimited story generations</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Ionicons name="checkmark-circle" size={22} color="#fff" />
            <Text style={styles.premiumFeature}>  Advanced AI Creativity</Text>
          </View>
          <TouchableOpacity style={styles.subscribeBtn}>
            <Text style={styles.subscribeBtnText}>Subscribe  <Ionicons name="arrow-forward" size={18} color="#232136" /></Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 8 }}>
            <Text style={styles.restoreText}>Restore purchase</Text>
          </TouchableOpacity>
        </View>

        {/* General */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.row}>
            <MaterialCommunityIcons name="share-variant" size={22} color="#232136" />
            <Text style={styles.rowText}>Share AI Story</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <MaterialIcons name="star-rate" size={22} color="#232136" />
            <Text style={styles.rowText}>Give AI Story 5 stars</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <MaterialIcons name="alternate-email" size={22} color="#232136" />
            <Text style={styles.rowText}>Contact us</Text>
          </TouchableOpacity>
        </View>

        {/* Terms & Privacy */}
        <Text style={styles.sectionTitle}>Terms & Privacy</Text>
        <View style={styles.sectionCard}>
          <TouchableOpacity style={styles.row}>
            <MaterialIcons name="description" size={22} color="#232136" />
            <Text style={styles.rowText}>Terms and Conditions</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <MaterialCommunityIcons name="shield-check" size={22} color="#232136" />
            <Text style={styles.rowText}>Privacy Policy</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <View style={[styles.row, { opacity: 0.7 }]}>
            <Ionicons name="information-circle-outline" size={22} color="#232136" />
            <Text style={styles.rowText}>App version</Text>
            <Text style={styles.versionText}>2.2.10</Text>
          </View>
        </View>
      </ScrollView>
      {/* Clear data button */}
      <TouchableOpacity style={styles.clearBtn}>
        <Text style={styles.clearBtnText}>Clear data</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  premiumCard: {
    backgroundColor: '#232136',
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  premiumTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  premiumFeature: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  subscribeBtn: {
    backgroundColor: '#fff',
    borderRadius: 32,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  subscribeBtnText: {
    color: '#232136',
    fontWeight: 'bold',
    fontSize: 18,
  },
  restoreText: {
    color: '#bdbdc7',
    fontSize: 15,
    textAlign: 'center',
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#232136',
    marginBottom: 8,
    marginLeft: 2,
  },
  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  rowText: {
    fontSize: 16,
    color: '#232136',
    marginLeft: 12,
    flex: 1,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 36,
  },
  versionText: {
    fontSize: 15,
    color: '#bdbdc7',
    marginRight: 8,
    fontWeight: '500',
  },
  clearBtn: {
    backgroundColor: '#fff',
    borderRadius: 32,
    margin: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  clearBtnText: {
    color: '#ff4d4f',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
