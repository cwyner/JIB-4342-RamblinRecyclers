import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DonationForm from '@/components/ui/DonationForm'

const ReceivingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log Donation</Text>
      <DonationForm /> {/* Display the donation form */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
})

export default ReceivingScreen