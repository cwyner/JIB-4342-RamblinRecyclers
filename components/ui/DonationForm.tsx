import React, { useState } from 'react'
import { View, TextInput, Button, Text, StyleSheet } from 'react-native'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { getApp } from 'firebase/app'

const DonationForm: React.FC = () => {
  const [donorName, setDonorName] = useState<string>('')
  const [itemDescription, setItemDescription] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleSubmit = async () => {
    const donationData = {
      donorName,
      itemDescription,
      quantity,
      donationDate: new Date().toISOString(),
    }

    try {
      // Get Firestore instance from initialized app
      const db = getFirestore(getApp())

      // Add donation data to Firestore
      const docRef = await addDoc(collection(db, 'donations'), donationData)

      // Successfully logged donation
      setMessage('Donation logged successfully!')
      setDonorName('')
      setItemDescription('')
      setQuantity('')
    } catch (error) {
      // Error in logging the donation
      setMessage('Error logging donation')
      console.error('Error adding document: ', error)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Donor Name"
        value={donorName}
        onChangeText={setDonorName}
        style={styles.input}
      />
      <TextInput
        placeholder="Item Description"
        value={itemDescription}
        onChangeText={setItemDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
      />
      <Button title="Submit Donation" onPress={handleSubmit} />
      {message && <Text>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
})

export default DonationForm
