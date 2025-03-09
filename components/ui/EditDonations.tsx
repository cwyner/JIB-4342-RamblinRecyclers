import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getApp } from 'firebase/app';

const EditDonations: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [itemName, setItemName] = useState<string>('');
  const [donorName, setDonorName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    const db = getFirestore(getApp());
    const q = collection(db, 'donations');
    
    try {
      const querySnapshot = await getDocs(q);
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
      await updateDoc(donationRef, { 
        itemDescription: itemName,
        donorName,
        quantity,
        comment 
      });
      alert('Donation updated successfully!');
      setSelectedDonation(null);
      setItemName('');
      setDonorName('');
      setQuantity('');
      setComment('');
      setModalVisible(false);
      fetchDonations();
    } catch (error) {
      console.error('Error updating donation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Donations</Text>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            onPress={() => {
              setSelectedDonation(item);
              setItemName(item.itemDescription || '');
              setDonorName(item.donorName || '');
              setQuantity(item.quantity ? String(item.quantity) : '');
              setComment(item.comment || '');
              setModalVisible(true);
            }} 
            style={styles.donationItem}
          >
            <Text>{item.itemDescription} - {item.status}</Text>
            <Text style={styles.commentText}>Donor: {item.donorName || 'Unknown'}</Text>
            <Text style={styles.commentText}>Quantity: {item.quantity || 'Unknown'}</Text>
            <Text style={styles.commentText}>Comment: {item.comment || 'No comments'}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Donation</Text>
            <TextInput
              placeholder="Item Name"
              value={itemName}
              onChangeText={setItemName}
              style={styles.input}
            />
            <TextInput
              placeholder="Donor Name"
              value={donorName}
              onChangeText={setDonorName}
              style={styles.input}
            />
            <TextInput
              placeholder="Quantity"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              style={styles.input}
            />
            <TextInput
              placeholder="Add/Edit Comment"
              value={comment}
              onChangeText={setComment}
              style={styles.input}
            />
            <Button title="Save" onPress={handleEditDonation} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  donationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  commentText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
});

export default EditDonations;