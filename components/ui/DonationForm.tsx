import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { TextInput, Button, Text } from "react-native-paper"
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { getApp } from 'firebase/app'
import emailjs from 'emailjs-com'

const DonationForm: React.FC = () => {
  const [donorName, setDonorName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [itemDescription, setItemDescription] = useState<string>('')
  const [quantity, setQuantity] = useState<string>('')
  const [message, setMessage] = useState<string>('')

  const handleSubmit = async () => {
    if (!donorName || !email || !itemDescription || !quantity) {
      Alert.alert('Please fill in all fields.')
      return
    }

    const donationData = {
      donorName,
      email,
      itemDescription,
      quantity,
      donationDate: new Date().toISOString(),
    }

    try {
      const db = getFirestore(getApp())
      await addDoc(collection(db, 'donations'), donationData)

      emailjs
        .send(
          'service_xgdp28h',
          'template_jaefims',
          {
            donor_name: donorName,
            email: email,
            item: itemDescription,
            quantity: quantity,
            date: new Date().toLocaleDateString(),
          },
           'anOEpZU3l3StWWkoi',
        )
        .then(() => {
          Alert.alert('Donation recorded and receipt emailed!')
        })
        .catch((error) => console.error('Email sending error:', error))

      setMessage('Donation logged successfully!')
      setDonorName('')
      setEmail('')
      setItemDescription('')
      setQuantity('')
    } catch (error) {
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
        mode="outlined"
      />
      <TextInput
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        placeholder="Item Description"
        value={itemDescription}
        onChangeText={setItemDescription}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={5}
      />
      <TextInput
        placeholder="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={styles.input}
        mode="outlined"
      />
      <Button 
        mode={"contained"}
        onPress={handleSubmit}>Submit Donation</Button>
      {message && <Text>{message}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
  },
})

export default DonationForm
