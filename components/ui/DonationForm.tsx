import React, { useState } from 'react'
import { SafeAreaView, ScrollView, StyleSheet, Alert, View } from 'react-native'
import { TextInput, Button, Text, Divider, IconButton, Menu } from "react-native-paper"
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import { getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { SegmentedButtons } from "react-native-paper"
import emailjs from 'emailjs-com'
import { TimePickerModal, DatePickerModal } from "react-native-paper-dates"
import { Snackbar } from 'react-native-paper'

interface Item {
  description: string
  quantity: string
  status: "Received" | "Refurbishing" | "Refurbished" | "Awaiting"
  materialCategory?: string
}

const formatTime = (hours: number, minutes: number) => {
  const period = hours >= 12 ? "PM" : "AM"
  const hour12 = hours % 12 === 0 ? 12 : hours % 12
  return `${hour12}:${minutes < 10 ? "0" : ""}${minutes} ${period}`
}

const formatDate = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

const DonationForm: React.FC = () => {
  const [donorName, setDonorName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [address, setAddress] = useState<string>("")
  const [city, setCity] = useState<string>("")
  const [state, setState] = useState<string>("Georgia")
  const [zipcode, setZipcode] = useState<string>("")
  const [method, setMethod] = useState<string>("")
  const [items, setItems] = useState<Item[]>([
    { description: '', quantity: '', status: 'Awaiting', materialCategory: '' }
  ])
  const [message, setMessage] = useState<string>('')
  const [openTimePicker, setOpenTimePicker] = useState(false)
  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [date, setDate] = useState("")
  const [hour, setHour] = useState("")
  const [toastVisible, setToastVisible] = useState(false)

  const showToast = (msg: string) => {
    setMessage(msg);
    setToastVisible(true);
  };

  // Track which item’s material menu is open (if any)
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)

  const handleItemChange = (index: number, key: keyof Item, value: string) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [key]: value }
    setItems(updatedItems)
  }

  const handleSelectMaterial = (index: number, category: string) => {
    const updatedItems = [...items]
    updatedItems[index].materialCategory = category
    setItems(updatedItems)
  }

  const getEmojiForMaterial = (category: string) => {
    switch(category) {
      case 'Wood':
        return '🪵'
      case 'Metals':
        return '🔩'
      case 'Textiles':
        return '🧵'
      default:
        return ''
    }
  }

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      const updatedItems = items.filter((_, i) => i !== index)
      setItems(updatedItems)
    }
  }

  const handleSubmit = async () => {
    if (
      !donorName
      || !email
      || items.some(item => !item.description|| !item.quantity)
      || !address
      || !city
      || !state
      || !zipcode
      || !method
      || !date
      || !hour
    ) {
      Alert.alert('Please fill in all fields.')
      return
    }

    const donationData = {
      donorName,
      email,
      items,
      address,
      city,
      state,
      zipcode,
      method,
      date,
      hour,
      donationDate: new Date().toISOString(),
    }

    try {
      const db = getFirestore(getApp())
      // Add donation document
      const donationRef = await addDoc(collection(db, 'donations'), donationData)

      // Retrieve the current user's ID from Firebase Authentication
      const auth = getAuth()
      const userId = auth.currentUser ? auth.currentUser.uid : 'anonymous'

      // Also add a calendar event for this donation (include userId)
      const eventData = {
        title: `Donation from ${donorName}`,
        date,      // using the same date as selected in the form
        time: hour, // using the selected time
        donationId: donationRef.id,
        userId,    // include the userId field
        description: `Donation event for ${donorName}. Method: ${method}.`
      }
      await addDoc(collection(db, 'events'), eventData)

      /*
      emailjs
        .send(
          'service_xgdp28h',
          'template_jaefims',
          {
            donor_name: donorName,
            email: email,
            item: items[0].description,
            quantity: items[0].quantity,
            date: new Date().toLocaleDateString(),
          },
          'anOEpZU3l3StWWkoi'
        )
        .then(() => {
          showToast('Donation recorded and receipt emailed!')
        })
        .catch((error) => console.error('Email sending error:', error))
      */
      showToast('Donation recorded and receipt emailed!')
      setDonorName('')
      setEmail('')
      setItems([{ description: '', quantity: '', status: 'Awaiting', materialCategory: '' }])
    } catch (error) {
      setMessage('Error logging donation')
      console.error('Error adding document: ', error)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SegmentedButtons
        value={method}
        onValueChange={setMethod}
        buttons={[
          {
            value: '📦 Drop Off',
            label: '📦 Drop Off',
          },
          {
            value: '🚚 Pick Up',
            label: '🚚 Pick Up',
          },
          { 
            value: '🗓️ Event',
            label: '🗓️ Event'
          },
        ]}
      />
      <ScrollView contentContainerStyle={styles.container}>
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
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
          keyboardType="default"
          style={styles.input}
          mode="outlined"
        />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TextInput
            placeholder="City"
            value={city}
            onChangeText={setCity}
            keyboardType="default"
            style={{ marginBottom: 15, overflow: "scroll", width: 175 }}
            mode="outlined"
          />
          <TextInput
            placeholder="State"
            value={state}
            onChangeText={setState}
            keyboardType="default"
            style={{ marginHorizontal: 6, marginBottom: 15, overflow: "scroll" }}
            mode="outlined"
          />
        </View>

        <TextInput
            placeholder="Zip Code"
            value={zipcode}
            onChangeText={setZipcode}
            keyboardType="default"
            style={{ marginBottom: 15, flex: 1 }}
            mode="outlined"
          />

        <Button
          mode="outlined"
          onPress={() => setOpenDatePicker(true)}
          style={styles.input}
        >
          {date ? `Date: ${date}` : "Select Date"}
        </Button>

        <Button
          mode="outlined"
          onPress={() => setOpenTimePicker(true)}
          style={styles.input}
        >
          {hour ? `Time: ${hour}` : "Select Time"}
        </Button>

        <TimePickerModal
          visible={openTimePicker}
          onDismiss={() => setOpenTimePicker(false)}
          onConfirm={({ hours, minutes }) => {
            if (!date) {
              Alert.alert('Select Date First', 'Please select a date before choosing a time.');
              return;
            }
            // Parse the date string "YYYY-MM-DD" to get year, month, and day
            const [year, month, day] = date.split('-').map(Number);
            // Create a new Date object using the parsed date and selected time
            const selectedDateTime = new Date(year, month - 1, day, hours, minutes);
            if (selectedDateTime <= new Date()) {
              Alert.alert('Invalid Time', 'Please select a time in the future.');
            } else {
              setHour(formatTime(hours, minutes));
              setOpenTimePicker(false);
            }
          }}
          hours={0}
          minutes={0}
          label="Select time"
          uppercase={false}
        />

        <DatePickerModal
          locale="en"
          mode="single"
          visible={openDatePicker}
          onDismiss={() => setOpenDatePicker(false)}
          date={date ? new Date(date) : new Date()}
          onConfirm={({ date: selectedDate }) => {
            // Check if the selected date is at least today or in the future.
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const chosenDate = new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate()
            );
            if (chosenDate < today) {
              Alert.alert('Invalid Date', 'Please select a date in the future.');
            } else {
              setDate(formatDate(selectedDate));
              setOpenDatePicker(false);
            }
          }}
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
            <Text style={styles.itemLabel}>Quantity</Text>
            <View style={{ height: 10 }} />
            <View style={styles.quantityRow}>
              <IconButton
                icon="minus"
                size={20}
                onPress={() => {
                  const newQty = Math.max(0, parseInt(item.quantity || '0') - 1)
                  handleItemChange(index, 'quantity', newQty.toString())
                }}
              />
              <TextInput
                value={item.quantity}
                onChangeText={(text) => {
                  const parsed = text.replace(/[^0-9]/g, '')
                  handleItemChange(index, 'quantity', parsed)
                }}
                keyboardType="numeric"
                mode="outlined"
                style={styles.quantityInput}
              />
              <IconButton
                icon="plus"
                size={20}
                onPress={() => {
                  const newQty = parseInt(item.quantity || '0') + 1
                  handleItemChange(index, 'quantity', newQty.toString())
                }}
              />
            </View>
            {/* Material Classification Dropdown */}
            <Menu
              visible={openMenuIndex === index}
              onDismiss={() => setOpenMenuIndex(null)}
              anchor={
                <Button mode="outlined" onPress={() => setOpenMenuIndex(index)}>
                  {item.materialCategory 
                    ? `${getEmojiForMaterial(item.materialCategory)} ${item.materialCategory}` 
                    : "Select Material"}
                </Button>
              }
            >
              <Menu.Item 
                onPress={() => { handleSelectMaterial(index, 'Wood'); setOpenMenuIndex(null); }} 
                title={"🪵 Wood"} 
              />
              <Menu.Item 
                onPress={() => { handleSelectMaterial(index, 'Metals'); setOpenMenuIndex(null); }} 
                title={"🔩 Metals"} 
              />
              <Menu.Item 
                onPress={() => { handleSelectMaterial(index, 'Textiles'); setOpenMenuIndex(null); }} 
                title={"🧵 Textiles"} 
              />
            </Menu>
          </View>
        ))}
        <Button
          icon="plus"
          mode="outlined"
          style={{ marginTop: 16 }}
          onPress={() => setItems([...items, { description: '', quantity: '', status: 'Awaiting', materialCategory: '' }])}
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
        <Snackbar
          visible={toastVisible}
          onDismiss={() => setToastVisible(false)}
          duration={3000}  // Duration in milliseconds
        >
          {message}
        </Snackbar>
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
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  quantityInput: {
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 8,
  },
})

export default DonationForm;