import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BenefitBox = () => {
  return (
    <View style={styles.featureList}>
      <View style={styles.featureItem}>
        <Ionicons
          name="infinite"
          size={28}
          color="#222"
          style={styles.featureIcon}
        />
        <View>
          <Text style={styles.featureTitle}>Unlimited Access</Text>
          <Text style={styles.featureDesc}>Endless story creations</Text>
        </View>
      </View>
      <View style={styles.featureItem}>
        <MaterialCommunityIcons
          name="crown-outline"
          size={28}
          color="#222"
          style={styles.featureIcon}
        />
        <View>
          <Text style={styles.featureTitle}>Advanced AI</Text>
          <Text style={styles.featureDesc}>Smarter AI, richer & more</Text>
        </View>
      </View>
      <View style={styles.featureItem}>
        <FontAwesome5
          name="wallet"
          size={24}
          color="#222"
          style={styles.featureIcon}
        />
        <View>
          <Text style={styles.featureTitle}>Ad-Free Experience</Text>
          <Text style={styles.featureDesc}>
            Focus on stories, not distractions
          </Text>
        </View>
      </View>
    </View>
  )
}


export default BenefitBox;

const styles = StyleSheet.create({
  featureList: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  featureIcon: {
    marginRight: 16,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  featureDesc: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  noteText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});
