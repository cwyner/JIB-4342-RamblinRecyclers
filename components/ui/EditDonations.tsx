// EditDonations.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { 
  SafeAreaView, 
  FlatList,
  Alert,
  Linking,
  StyleSheet,
  View,
  Text
} from 'react-native';
import { Title, IconButton } from 'react-native-paper';
import { getFirestore, collection, updateDoc, doc, onSnapshot, deleteDoc } from 'firebase/firestore';
import { getApp } from 'firebase/app';
import DonationCard, { Donation } from './DonationCard';
import DonationFilterModal from './DonationFilterModal';
import DonationSortModal from './DonationSortModal';
import DonationEditModal from './DonationEditModal';
import { formatDate, getEmojiForCategory } from './utils';
import { Item } from './EditItemInput';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

const EditDonations: React.FC = () => {
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [donorName, setDonorName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [editItems, setEditItems] = useState<Item[]>([]);
  const [comment, setComment] = useState<string>('');

  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [donationState, setDonationState] = useState<string>('Georgia');
  const [zipcode, setZipcode] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const [filterMethod, setFilterMethod] = useState<string>('');
  const [filterMaterialStatus, setFilterMaterialStatus] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const [openWeightUnitMenuIndex, setOpenWeightUnitMenuIndex] = useState<number | null>(null);
  const [expirationDatePickerVisible, setExpirationDatePickerVisible] = useState(false);
  const [expirationItemIndex, setExpirationItemIndex] = useState<number | null>(null);

  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOption, setSortOption] = useState<string>('recent');

  useEffect(() => {
    const db = getFirestore(getApp());
    const donationsRef = collection(db, 'donations');
    const unsubscribe = onSnapshot(donationsRef, (snapshot) => {
      const donationList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDonations(donationList);
    }, (error) => {
      console.error('Error fetching donations:', error);
    });
    return () => unsubscribe();
  }, []);

  const handleDeleteDonation = async (donation: Donation) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this donation record?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const db = getFirestore(getApp());
              await deleteDoc(doc(db, 'donations', donation.id));
              Alert.alert("Success", "Donation record deleted successfully.");
            } catch (error) {
              console.error("Error deleting donation:", error);
              Alert.alert("Error", "Failed to delete donation record.");
            }
          }
        }
      ]
    );
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
      updatedData.weight = editItems[0]?.weight || '';
      updatedData.weightUnit = editItems[0]?.weightUnit || 'lbs';
      updatedData.status = editItems[0]?.status || 'Awaiting';
      updatedData.materialCategory = editItems[0]?.materialCategory || '';
      updatedData.expirationDate = editItems[0]?.expirationDate || '';
    }

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
      Alert.alert('Success', 'Donation updated successfully!');
      resetModal();
    } catch (error) {
      console.error('Error updating donation:', error);
    }
  };

  const resetModal = useCallback(() => {
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
  }, []);

  const handleEditItemChange = useCallback((index: number, key: keyof Item, value: string) => {
    setEditItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  }, []);

  const handleRemoveEditItem = useCallback((index: number) => {
    setEditItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddEditItem = useCallback(() => {
    setEditItems(prev => ([
      ...prev, 
      { 
        description: '', 
        quantity: '', 
        weight: '', 
        weightUnit: 'lbs', 
        status: "Awaiting", 
        materialCategory: '', 
        expirationDate: '' 
      }
    ]));
  }, []);

  const openDonationModal = (item: any) => {
    setSelectedDonation(item);
    setDonorName(item.donorName || '');
    setEmail(item.email || '');
    setComment(item.comment || '');

    setAddress(item.address || '');
    setCity(item.city || '');
    setDonationState(item.state || 'Georgia');
    setZipcode(item.zipcode || '');
    setMethod(item.method || '');
    setSelectedDate(item.selectedDate || '');
    setSelectedTime(item.selectedTime || '');

    if (item.items && Array.isArray(item.items)) {
      setEditItems(item.items.map((itm: any) => ({
        description: itm.description || '',
        quantity: itm.quantity ? String(itm.quantity) : '',
        weight: itm.weight || '',
        weightUnit: itm.weightUnit || 'lbs',
        status: itm.status || "Awaiting",
        materialCategory: itm.materialCategory || '',
        expirationDate: itm.expirationDate || ''
      })));
    } else {
      setEditItems([{ 
        description: item.itemDescription || '', 
        quantity: item.quantity ? String(item.quantity) : '',
        weight: item.weight || '',
        weightUnit: item.weightUnit || 'lbs',
        status: item.status || "Awaiting",
        materialCategory: item.materialCategory || '',
        expirationDate: item.expirationDate || ''
      }]);
    }
    setModalVisible(true);
  };

  const openGoogleMaps = (donation: any) => {
    const addressParts = [];
    if (donation.address) addressParts.push(donation.address);
    if (donation.city) addressParts.push(donation.city);
    if (donation.state) addressParts.push(donation.state);
    if (donation.zipcode) addressParts.push(donation.zipcode);
    const query = encodeURIComponent(addressParts.join(', '));
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    Linking.openURL(url).catch(err => {
      console.error("Failed to open Google Maps:", err);
      Alert.alert("Error", "Unable to open Google Maps.");
    });
  };

  // DatePickerModal functions for expiration dates
  const handleConfirmExpirationDate = ({ date }: { date: Date }) => {
    if (expirationItemIndex !== null) {
      const formattedDate = formatDate(date);
      setEditItems(prev => {
        const updated = [...prev];
        updated[expirationItemIndex].expirationDate = formattedDate;
        return updated;
      });
    }
    setExpirationDatePickerVisible(false);
    setExpirationItemIndex(null);
  };

  const handleDismissExpirationDatePicker = () => {
    setExpirationDatePickerVisible(false);
    setExpirationItemIndex(null);
  };

  const handleDownloadReceipt = async (donation: any) => {
    const htmlContent = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Donation Receipt</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 20px;
              color: #333;
              line-height: 1.6;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              color: #2c3e50;
              margin-bottom: 5px;
            }
            .header p {
              font-size: 14px;
            }
            .info-section {
              margin-bottom: 20px;
            }
            .info-section p {
              margin: 4px 0;
            }
            .info-section .label {
              font-weight: bold;
            }
            .items-section {
              margin-top: 30px;
            }
            .items-section h2 {
              border-bottom: 2px solid #2c3e50;
              padding-bottom: 5px;
              color: #2c3e50;
            }
            .item {
              margin-left: 20px;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Donation Receipt</h1>
            <p><span class="label">Receipt ID:</span> ${donation.id}</p>
          </div>
          <div class="info-section">
            <p><span class="label">Submitted At:</span> ${donation.donationDate || 'Unknown'}</p>
            <p><span class="label">Donor:</span> ${donation.donorName || 'Unknown'}</p>
            <p><span class="label">Email:</span> ${donation.email || 'Unknown'}</p>
            <p><span class="label">Comment:</span> ${donation.comment || 'No comments'}</p>
            ${donation.address ? `<p><span class="label">Address:</span> ${donation.address}</p>` : ''}
            ${donation.city ? `<p><span class="label">City:</span> ${donation.city}</p>` : ''}
            ${donation.state ? `<p><span class="label">State:</span> ${donation.state}</p>` : ''}
            ${donation.zipcode ? `<p><span class="label">Zipcode:</span> ${donation.zipcode}</p>` : ''}
            ${donation.method ? `<p><span class="label">Method:</span> ${donation.method}</p>` : ''}
            ${donation.selectedDate ? `<p><span class="label">Date:</span> ${donation.selectedDate}</p>` : ''}
            ${donation.selectedTime ? `<p><span class="label">Time:</span> ${donation.selectedTime}</p>` : ''}
          </div>
          <div class="items-section">
            <h2>Items</h2>
            ${
              donation.items && Array.isArray(donation.items)
                ? donation.items.map((itm: any, idx: number) => (
                    `<div class="item">
                      ${idx + 1}. ${itm.description} - ${itm.quantity} 
                      ${itm.weight ? `- Weight: ${itm.weight} ${itm.weightUnit || 'lbs'}` : ''} 
                      ${itm.materialCategory ? `- ${getEmojiForCategory(itm.materialCategory)} ${itm.materialCategory}` : ''} 
                      ${itm.expirationDate ? `- Expires: ${itm.expirationDate}` : ''} 
                      (${itm.status})
                    </div>`
                  )).join('')
                : `<div class="item">
                      ${donation.itemDescription} - ${donation.quantity} 
                      ${donation.weight ? `- Weight: ${donation.weight} ${donation.weightUnit || 'lbs'}` : ''} 
                      (${donation.status})
                   </div>`
            }
          </div>
        </body>
      </html>
    `;
  
    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });
  
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'PDF Receipt Preview'
        });
      } else {
        Alert.alert('PDF Generated', `PDF saved to: ${uri}`);
      }
    } catch (error) {
      console.error('Error generating PDF receipt:', error);
      Alert.alert('Error', 'There was an error generating the PDF receipt.');
    }
  };

  const filteredDonations = () => {
    return donations.filter(item => {
      let methodMatch = true;
      let statusMatch = true;
      let categoryMatch = true;

      if (filterMethod.trim() !== '') {
        methodMatch = item.method && item.method.toLowerCase() === filterMethod.toLowerCase();
      }

      if (filterMaterialStatus.trim() !== '') {
        if (item.items && Array.isArray(item.items)) {
          statusMatch = item.items.some((i: any) => i.status && i.status.toLowerCase() === filterMaterialStatus.toLowerCase());
        } else {
          statusMatch = item.status && item.status.toLowerCase() === filterMaterialStatus.toLowerCase();
        }
      }

      if (filterCategory.trim() !== '') {
        if (item.items && Array.isArray(item.items)) {
          categoryMatch = item.items.some((i: any) => i.materialCategory && i.materialCategory.toLowerCase() === filterCategory.toLowerCase());
        } else {
          categoryMatch = item.materialCategory && item.materialCategory.toLowerCase() === filterCategory.toLowerCase();
        }
      }

      return methodMatch && statusMatch && categoryMatch;
    });
  };

  const sortedDonations = filteredDonations().slice().sort((a, b) => {
    if (sortOption === 'recent') {
      return new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime();
    } else if (sortOption === 'weight') {
      const aWeight = a.items && a.items.length > 0 ? Number(a.items[0].weight) || 0 : Number(a.weight) || 0;
      const bWeight = b.items && b.items.length > 0 ? Number(b.items[0].weight) || 0 : Number(b.weight) || 0;
      return aWeight - bWeight;
    } else if (sortOption === 'expiration') {
      const aExp = a.items && a.items.length > 0 ? a.items[0].expirationDate : a.expirationDate;
      const bExp = b.items && b.items.length > 0 ? b.items[0].expirationDate : b.expirationDate;
      const aTime = aExp ? new Date(aExp).getTime() : Infinity;
      const bTime = bExp ? new Date(bExp).getTime() : Infinity;
      return aTime - bTime;
    }
    return 0;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <Title style={styles.title}>Edit Donations</Title>
          <View style={{ flexDirection: 'row' }}>
            <IconButton icon="filter" onPress={() => setFilterModalVisible(true)} />
            <IconButton icon="sort" onPress={() => setSortModalVisible(true)} />
          </View>
        </View>
        <Text style={styles.subtitle}>Tap a donation to edit it</Text>
      </View>
      <FlatList
        data={sortedDonations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <DonationCard 
            donation={item}
            openDonationModal={openDonationModal}
            handleDownloadReceipt={handleDownloadReceipt}
            openGoogleMaps={openGoogleMaps}
            handleDeleteDonation={handleDeleteDonation}
          />
        )}
      />
      <DonationFilterModal 
        visible={filterModalVisible}
        onDismiss={() => setFilterModalVisible(false)}
        filterMethod={filterMethod}
        setFilterMethod={setFilterMethod}
        filterMaterialStatus={filterMaterialStatus}
        setFilterMaterialStatus={setFilterMaterialStatus}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
      />
      <DonationSortModal 
        visible={sortModalVisible}
        onDismiss={() => setSortModalVisible(false)}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />
      <DonationEditModal 
        visible={modalVisible}
        donation={selectedDonation}
        donorName={donorName}
        email={email}
        address={address}
        city={city}
        donationState={donationState}
        zipcode={zipcode}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        comment={comment}
        editItems={editItems}
        openMenuIndex={openMenuIndex}
        setOpenMenuIndex={setOpenMenuIndex}
        openWeightUnitMenuIndex={openWeightUnitMenuIndex}
        setOpenWeightUnitMenuIndex={setOpenWeightUnitMenuIndex}
        onSetExpirationItem={(index) => {
          setExpirationItemIndex(index);
          setExpirationDatePickerVisible(true);
        }}
        handleEditItemChange={handleEditItemChange}
        handleRemoveEditItem={handleRemoveEditItem}
        handleAddEditItem={handleAddEditItem}
        setDonorName={setDonorName}
        setEmail={setEmail}
        setAddress={setAddress}
        setCity={setCity}
        setDonationState={setDonationState}
        setZipcode={setZipcode}
        setSelectedDate={setSelectedDate}
        setSelectedTime={setSelectedTime}
        setComment={setComment}
        onSave={handleEditDonation}
        onCancel={resetModal}
        expirationDatePickerVisible={expirationDatePickerVisible}
        expirationItemIndex={expirationItemIndex}
        handleConfirmExpirationDate={handleConfirmExpirationDate}
        handleDismissExpirationDatePicker={handleDismissExpirationDatePicker}
      />
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  listContainer: {
    paddingBottom: 20,
  },
});

export default EditDonations;