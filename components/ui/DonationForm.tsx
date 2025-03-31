import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Alert, View } from 'react-native'
import { TextInput, Button, Text, Divider, IconButton } from "react-native-paper"
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { getApp } from 'firebase/app'
import emailjs from 'emailjs-com'

interface Item {
  description: string
  quantity: string
  expDate: string
}

const DonationForm: React.FC = () => {
  const [donorName, setDonorName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [items, setItems] = useState<Item[]>([{ description: '', quantity: '', expDate: ''}])
  const [message, setMessage] = useState<string>('')

  const handleItemChange = (index: number, key: keyof Item, value: string) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [key]: value }
    setItems(updatedItems)
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index)
      setItems(updatedItems)
    }
  }

  const handleSubmit = async () => {
    if (!donorName || !email || items.some(item => !item.description || !item.quantity)) {
      Alert.alert('Please fill in all fields.')
      return
    }

    const donationData = {
      donorName,
      email,
      items,
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
            item: items[0].description,
            quantity: items[0].quantity,
            expDate: items[0].expDate,
            date: new Date().toLocaleDateString(),
          },
          'anOEpZU3l3StWWkoi'
        )
        .then(() => {
          Alert.alert('Donation recorded and receipt emailed!')
        })
        .catch((error) => console.error('Email sending error:', error))

      setMessage('Donation logged successfully!')
      setDonorName('')
      setEmail('')
      setItems([{ description: '', quantity: '', expDate: '' }])
    } catch (error) {
      setMessage('Error logging donation')
      console.error('Error adding document: ', error)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.itemLabel}>Donor Name</Text>
        <TextInput
          placeholder="Donor Name"
          value={donorName}
          onChangeText={setDonorName}
          style={styles.input}
          mode="outlined"
        />
        <Text style={styles.itemLabel}>Email Address</Text>
        <TextInput
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
          mode="outlined"
        />
        {items.map((item, index) => (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemLabel}>Item {index + 1}</Text>
              {items.length > 1 && (
                <IconButton 
                  icon="delete"
                  size={20}
                  onPress={() => handleRemoveItem(index)}
                />
              )}
            </View>
            <Divider style={styles.itemDivider} />
            <TextInput
              placeholder="Item Description"
              value={item.description}
              onChangeText={(text) => handleItemChange(index, 'description', text)}
              style={styles.input}
              mode="outlined"
              multiline
              numberOfLines={3}
            />
            <TextInput
              placeholder="Quantity"
              value={item.quantity}
              onChangeText={(text) => handleItemChange(index, 'quantity', text)}
              keyboardType="numeric"
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              placeholderTextColor={'grey'}
              placeholder="Expiration Date (optional)"
              value={item.expDate}
              onChangeText={(text) => handleItemChange(index, 'expDate', text)}
              style={styles.input}
              mode="outlined"
            />
          </View>
        ))}
        <Button
          icon="plus"
          mode="outlined"
          style={{ marginTop: 16 }}
          onPress={() => setItems([...items, { description: '', quantity: '', expDate: '' }])}
        >
          Add item
        </Button>
        <Button 
          mode="contained"
          onPress={handleSubmit}
          style={{ marginTop: 16 }}
        >
          Submit Donation
        </Button>
        {message && <Text>{message}</Text>}
      </ScrollView>
    </SafeAreaView>
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
  itemContainer: {
    marginBottom: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDivider: {
    marginBottom: 10,
  }
})

export default DonationForm