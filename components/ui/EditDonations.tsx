import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import { Divider, IconButton, Modal, TextInput, Button } from 'react-native-paper';
import { MaterialStatusTag } from './MaterialStatusTag';

interface Item {
  description: string;
  quantity: string;
}

const EditDonations: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [donorName, setDonorName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [editItems, setEditItems] = useState<Item[]>([]);
  const [comment, setComment] = useState<string>('');
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

    try {
      if (selectedDonation.items) {
        await updateDoc(donationRef, { 
          donorName,
          email,
          items: editItems,
          comment
        });
      } else {
        await updateDoc(donationRef, { 
          donorName,
          itemDescription: editItems[0]?.description || '',
          quantity: editItems[0]?.quantity || '',
          comment
        });
      }
      alert('Donation updated successfully!');
      resetModal();
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation:', error);
    }
  };

  const resetModal = () => {
    setSelectedDonation(null);
    setDonorName('');
    setEmail('');
    setEditItems([]);
    setComment('');
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
    setEditItems([...editItems, { description: '', quantity: '' }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Edit Donations</Text>
        <Text>Tap a donation to edit it:</Text>
      </View>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => {
              setSelectedDonation(item);
              setDonorName(item.donorName || '');
              setEmail(item.email || '');
              setComment(item.comment || '');
              if (item.items && Array.isArray(item.items)) {
                setEditItems(item.items);
              } else {
                setEditItems([{ 
                  description: item.itemDescription || '', 
                  quantity: item.quantity ? String(item.quantity) : '' 
                }]);
              }
              setModalVisible(true);
            }} 
            style={styles.donationItem}
          >
            <MaterialStatusTag name="Refurbishing" />
            {item.items && Array.isArray(item.items) ? (
              <>
                {item.items.map((itm: Item, idx: number) => (
                  <Text key={idx}>Item {idx + 1}: {itm.description} - {itm.quantity}</Text>
                ))}
                <Text style={styles.commentText}>Donor: {item.donorName || 'Unknown'}</Text>
              </>
            ) : (
              <>
                <Text>{item.itemDescription} - {item.status}</Text>
                <Text style={styles.commentText}>Donor: {item.donorName || 'Unknown'}</Text>
                <Text style={styles.commentText}>Quantity: {item.quantity || 'Unknown'}</Text>
              </>
            )}
            <Text style={styles.commentText}>Comment: {item.comment || 'No comments'}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        onDismiss={resetModal}
        contentContainerStyle={styles.modalContentWrapper}
        visible={modalVisible}
        dismissable={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ width: '100%' }} // Changed from flex: 1 to width: '100%'
        >
          <ScrollView 
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.modalTitle}>Edit Donation</Text>
            <TextInput
              placeholder="Donor Name"
              value={donorName}
              onChangeText={setDonorName}
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
            />
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
                <Divider style={styles.itemDivider} />
                <TextInput
                  placeholder="Item Description"
                  value={item.description}
                  onChangeText={(text) => handleEditItemChange(index, 'description', text)}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  placeholder="Quantity"
                  value={item.quantity}
                  onChangeText={(text) => handleEditItemChange(index, 'quantity', text)}
                  keyboardType="numeric"
                  style={styles.input}
                  mode="outlined"
                />
              </View>
            ))}
            <Button icon="plus" onPress={handleAddEditItem}>Add Item</Button>
            <Divider style={styles.itemDivider} />
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
              <View style={styles.buttonWrapper}>
                <Button mode="contained" onPress={handleEditDonation}>Save</Button>
              </View>
              <View style={styles.buttonWrapper}>
                <Button mode="outlined" onPress={resetModal}>Cancel</Button>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  flatListContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  donationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    marginBottom: 10,
  },
  commentText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  modalContentWrapper: {
    marginHorizontal: 20,
    marginVertical: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'center',
  },
  input: {
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  itemContainer: {
    marginBottom: 20,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDivider: {
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});

export default EditDonations;