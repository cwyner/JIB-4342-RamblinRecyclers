import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  ScrollView,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { 
  Card, 
  Title, 
  Text, 
  TextInput, 
  Button, 
  IconButton, 
  Divider, 
  Modal,
  Portal 
} from 'react-native-paper';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { MaterialStatusTag } from './MaterialStatusTag';

interface Item {
  description: string;
  quantity: string;
  status: "Received" | "Refurbishing" | "Refurbished";
}

const EditDonations: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [donorName, setDonorName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [editItems, setEditItems] = useState<Item[]>([]);
  const [comment, setComment] = useState<string>('');

  // New fields state
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [donationState, setDonationState] = useState<string>('Georgia');
  const [zipcode, setZipcode] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // New filter states
  const [filterMethod, setFilterMethod] = useState<string>('');
  const [filterMaterialStatus, setFilterMaterialStatus] = useState<string>('');
  
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const db = getFirestore(getApp());
    const donationsRef = collection(db, 'donations');
    try {
      const querySnapshot = await getDocs(donationsRef);
      const donationList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(donationList);
    } catch (error) {
      console.error('Error fetching donations:', error);
    }
  };

  const handleEditDonation = async () => {
    if (!selectedDonation) return;
    const db = getFirestore(getApp());
    const donationRef = doc(db, 'donations', selectedDonation.id);

    const updatedData: any = {
      donorName,
      email,
      comment,
    };

    if (selectedDonation.items) {
      updatedData.items = editItems;
    } else {
      updatedData.itemDescription = editItems[0]?.description || '';
      updatedData.quantity = editItems[0]?.quantity || '';
      updatedData.status = editItems[0]?.status || 'Refurbishing';
    }

    // Only update new fields if they exist on the original donation
    if (selectedDonation.address !== undefined) {
      updatedData.address = address;
    }
    if (selectedDonation.city !== undefined) {
      updatedData.city = city;
    }
    if (selectedDonation.state !== undefined) {
      updatedData.state = donationState;
    }
    if (selectedDonation.zipcode !== undefined) {
      updatedData.zipcode = zipcode;
    }
    if (selectedDonation.method !== undefined) {
      updatedData.method = method;
    }
    if (selectedDonation.selectedDate !== undefined) {
      updatedData.selectedDate = selectedDate;
    }
    if (selectedDonation.selectedTime !== undefined) {
      updatedData.selectedTime = selectedTime;
    }

    try {
      await updateDoc(donationRef, updatedData);
      alert('Donation updated successfully!');
      resetModal();
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation:', error);
    }
  };

  const handleItemStatusChange = (index: number, newStatus: "Received" | "Refurbishing" | "Refurbished") => {
    const updatedItems = [...editItems];
    updatedItems[index] = { ...updatedItems[index], status: newStatus };
    setEditItems(updatedItems);
  };

  const resetModal = () => {
    setSelectedDonation(null);
    setDonorName('');
    setEmail('');
    setEditItems([]);
    setComment('');
    setAddress('');
    setCity('');
    setDonationState('Georgia');
    setZipcode('');
    setMethod('');
    setSelectedDate('');
    setSelectedTime('');
    setModalVisible(false);
  };

  const handleEditItemChange = (index: number, key: keyof Item, value: string) => {
    const updatedItems = [...editItems];
    updatedItems[index] = { ...updatedItems[index], [key]: value };
    setEditItems(updatedItems);
  };

  const handleRemoveEditItem = (index: number) => {
    if (editItems.length > 1) {
      const updatedItems = editItems.filter((_, i) => i !== index);
      setEditItems(updatedItems);
    }
  };

  const handleAddEditItem = () => {
    setEditItems([...editItems, { description: '', quantity: '', status: "Refurbishing" }]);
  };

  const openDonationModal = (item: any) => {
    setSelectedDonation(item);
    setDonorName(item.donorName || '');
    setEmail(item.email || '');
    setComment(item.comment || '');

    // Set new fields if they exist on the donation
    setAddress(item.address || '');
    setCity(item.city || '');
    setDonationState(item.state || 'Georgia');
    setZipcode(item.zipcode || '');
    setMethod(item.method || '');
    setSelectedDate(item.selectedDate || '');
    setSelectedTime(item.selectedTime || '');

    if (item.items && Array.isArray(item.items)) {
      setEditItems(item.items);
    } else {
      setEditItems([{ 
        description: item.itemDescription || '', 
        quantity: item.quantity ? String(item.quantity) : '',
        status: item.status || "Refurbishing"
      }]);
    }
    setModalVisible(true);
  };

  // Filter donations based on method and material status
  const filteredDonations = donations.filter(item => {
    let methodMatch = true;
    let statusMatch = true;

    if (filterMethod.trim() !== '') {
      methodMatch = item.method && item.method.toLowerCase().includes(filterMethod.toLowerCase());
    }

    if (filterMaterialStatus.trim() !== '') {
      if (item.items && Array.isArray(item.items)) {
        statusMatch = item.items.some((i: any) => i.status.toLowerCase() === filterMaterialStatus.toLowerCase());
      } else {
        statusMatch = item.status && item.status.toLowerCase() === filterMaterialStatus.toLowerCase();
      }
    }

    return methodMatch && statusMatch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Title style={styles.title}>Edit Donations</Title>
        <Text style={styles.subtitle}>Tap a donation to edit it</Text>
      </View>
      <View style={styles.filterContainer}>
        <TextInput
          placeholder="Filter by Method"
          value={filterMethod}
          onChangeText={setFilterMethod}
          mode="outlined"
          style={styles.filterInput}
        />
        <TextInput
          placeholder="Filter by Material Status"
          value={filterMaterialStatus}
          onChangeText={setFilterMaterialStatus}
          mode="outlined"
          style={styles.filterInput}
        />
      </View>
      <FlatList
        data={filteredDonations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => openDonationModal(item)}>
            <Card.Content>
              {item.items && Array.isArray(item.items) ? (
                item.items.map((itm: Item, idx: number) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemText}>
                      {idx + 1}. {itm.description} - {itm.quantity}
                    </Text>
                    <MaterialStatusTag name={itm.status || "Refurbishing"} />
                  </View>
                ))
              ) : (
                <>
                  <View style={styles.itemRow}>
                    <Text style={styles.itemText}>{item.itemDescription}</Text>
                    <MaterialStatusTag name={item.status || "Refurbishing"} />
                  </View>
                  <Text style={styles.subText}>Quantity: {item.quantity || 'Unknown'}</Text>
                </>
              )}
              <Divider style={styles.divider} />
              <Text style={styles.subText}>Donor: {item.donorName || 'Unknown'}</Text>
              <Text style={styles.subText}>Comment: {item.comment || 'No comments'}</Text>
              
            </Card.Content>
          </Card>
        )}
      />

      <Portal>
        <Modal 
          visible={modalVisible} 
          onDismiss={resetModal}
          contentContainerStyle={styles.modalContentWrapper}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={{ width: '100%' }}
          >
            <ScrollView keyboardShouldPersistTaps="handled">
              <Title style={styles.modalTitle}>Edit Donation</Title>
              <TextInput
                placeholder="Donor Name"
                value={donorName}
                onChangeText={setDonorName}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
              />
              {selectedDonation?.address !== undefined && (
                <TextInput
                  placeholder="Address"
                  value={address}
                  onChangeText={setAddress}
                  mode="outlined"
                  style={styles.input}
                />
              )}
              {selectedDonation?.city !== undefined && (
                <TextInput
                  placeholder="City"
                  value={city}
                  onChangeText={setCity}
                  mode="outlined"
                  style={styles.input}
                />
              )}
              {selectedDonation?.state !== undefined && (
                <TextInput
                  placeholder="State"
                  value={donationState}
                  onChangeText={setDonationState}
                  mode="outlined"
                  style={styles.input}
                />
              )}
              {selectedDonation?.zipcode !== undefined && (
                <TextInput
                  placeholder="Zip Code"
                  value={zipcode}
                  onChangeText={setZipcode}
                  mode="outlined"
                  style={styles.input}
                />
              )}
              {selectedDonation?.selectedDate !== undefined && (
                <TextInput
                  placeholder="Selected Date"
                  value={selectedDate}
                  onChangeText={setSelectedDate}
                  mode="outlined"
                  style={styles.input}
                />
              )}
              {selectedDonation?.selectedTime !== undefined && (
                <TextInput
                  placeholder="Selected Time"
                  value={selectedTime}
                  onChangeText={setSelectedTime}
                  mode="outlined"
                  style={styles.input}
                />
              )}
              {editItems.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemLabel}>Item {index + 1}</Text>
                    {editItems.length > 1 && (
                      <IconButton 
                        icon="delete" 
                        size={20} 
                        onPress={() => handleRemoveEditItem(index)} 
                      />
                    )}
                  </View>
                  <Divider style={styles.divider} />
                  <TextInput
                    placeholder="Item Description"
                    value={item.description}
                    onChangeText={(text) => handleEditItemChange(index, 'description', text)}
                    mode="outlined"
                    style={styles.input}
                  />
                  <View style={styles.quantityRow}>
                    <IconButton
                      icon="minus"
                      size={20}
                      onPress={() => {
                        const newQty = Math.max(0, parseInt(item.quantity || '0') - 1);
                        handleEditItemChange(index, 'quantity', newQty.toString());
                      }}
                    />
                    <TextInput
                      value={item.quantity}
                      onChangeText={(text) => {
                        const parsed = text.replace(/[^0-9]/g, '');
                        handleEditItemChange(index, 'quantity', parsed);
                      }}
                      keyboardType="numeric"
                      mode="outlined"
                      style={styles.quantityInput}
                    />
                    <IconButton
                      icon="plus"
                      size={20}
                      onPress={() => {
                        const newQty = parseInt(item.quantity || '0') + 1;
                        handleEditItemChange(index, 'quantity', newQty.toString());
                      }}
                    />
                  </View>
                  <MaterialStatusTag 
                    name={item.status || "Refurbishing"} 
                    onStatusChange={(newStatus) => handleItemStatusChange(index, newStatus)}
                  />
                </View>
              ))}
              <Button 
                icon="plus" 
                mode="outlined" 
                onPress={handleAddEditItem}
                style={styles.addButton}
              >
                Add Item
              </Button>
              <Divider style={styles.divider} />
              <Text style={styles.itemLabel}>Add a comment (optional)</Text>
              <TextInput
                placeholder="Comment"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                mode="outlined"
                style={styles.input}
              />
              <View style={styles.buttonContainer}>
                <Button 
                  mode="contained" 
                  onPress={handleEditDonation} 
                  style={styles.buttonWrapper}
                >
                  Save
                </Button>
                <Button 
                  mode="outlined" 
                  onPress={resetModal} 
                  style={styles.buttonWrapper}
                >
                  Cancel
                </Button>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </Portal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFEFEF',
  },
  headerContainer: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterInput: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  itemText: {
    fontSize: 16,
    color: '#444',
  },
  subText: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  divider: {
    marginVertical: 10,
  },
  modalContentWrapper: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 24,
    fontWeight: '700',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  itemContainer: {
    marginBottom: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
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
  addButton: {
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 10,
  },
});

export default EditDonations;