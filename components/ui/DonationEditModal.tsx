// DonationEditModal.tsx
import React from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { Modal, Portal, Title, TextInput, Button, Divider } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';
import EditItemInput, { Item } from './EditItemInput';

interface DonationEditModalProps {
  visible: boolean;
  donation: any;
  donorName: string;
  email: string;
  address: string;
  city: string;
  donationState: string;
  zipcode: string;
  selectedDate: string;
  selectedTime: string;
  comment: string;
  editItems: Item[];
  openMenuIndex: number | null;
  setOpenMenuIndex: (index: number | null) => void;
  openWeightUnitMenuIndex: number | null;
  setOpenWeightUnitMenuIndex: (index: number | null) => void;
  onSetExpirationItem: (index: number) => void;
  handleEditItemChange: (index: number, key: keyof Item, value: string) => void;
  handleRemoveEditItem: (index: number) => void;
  handleAddEditItem: () => void;
  setDonorName: (value: string) => void;
  setEmail: (value: string) => void;
  setAddress: (value: string) => void;
  setCity: (value: string) => void;
  setDonationState: (value: string) => void;
  setZipcode: (value: string) => void;
  setSelectedDate: (value: string) => void;
  setSelectedTime: (value: string) => void;
  setComment: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  expirationDatePickerVisible: boolean;
  expirationItemIndex: number | null;
  handleConfirmExpirationDate: ({ date }: { date: Date }) => void;
  handleDismissExpirationDatePicker: () => void;
}

const DonationEditModal: React.FC<DonationEditModalProps> = ({
  visible,
  donation,
  donorName,
  email,
  address,
  city,
  donationState,
  zipcode,
  selectedDate,
  selectedTime,
  comment,
  editItems,
  openMenuIndex,
  setOpenMenuIndex,
  openWeightUnitMenuIndex,
  setOpenWeightUnitMenuIndex,
  onSetExpirationItem,
  handleEditItemChange,
  handleRemoveEditItem,
  handleAddEditItem,
  setDonorName,
  setEmail,
  setAddress,
  setCity,
  setDonationState,
  setZipcode,
  setSelectedDate,
  setSelectedTime,
  setComment,
  onSave,
  onCancel,
  expirationDatePickerVisible,
  expirationItemIndex,
  handleConfirmExpirationDate,
  handleDismissExpirationDatePicker,
}) => {
  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onCancel}
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
              defaultValue={donorName}
              onChangeText={setDonorName}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              placeholder="Email"
              defaultValue={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
            />
            {donation?.address !== undefined && (
              <TextInput
                placeholder="Address"
                defaultValue={address}
                onChangeText={setAddress}
                mode="outlined"
                style={styles.input}
              />
            )}
            {donation?.city !== undefined && (
              <TextInput
                placeholder="City"
                defaultValue={city}
                onChangeText={setCity}
                mode="outlined"
                style={styles.input}
              />
            )}
            {donation?.state !== undefined && (
              <TextInput
                placeholder="State"
                defaultValue={donationState}
                onChangeText={setDonationState}
                mode="outlined"
                style={styles.input}
              />
            )}
            
            {donation?.selectedDate !== undefined && (
              <TextInput
                placeholder="Selected Date"
                defaultValue={selectedDate}
                onChangeText={setSelectedDate}
                mode="outlined"
                style={styles.input}
              />
            )}
            {donation?.selectedTime !== undefined && (
              <TextInput
                placeholder="Selected Time"
                defaultValue={selectedTime}
                onChangeText={setSelectedTime}
                mode="outlined"
                style={styles.input}
              />
            )}
            {editItems.map((item, index) => (
              <EditItemInput 
                key={index}
                item={item}
                index={index}
                handleEditItemChange={handleEditItemChange}
                handleRemoveEditItem={handleRemoveEditItem}
                openMenuIndex={openMenuIndex}
                setOpenMenuIndex={setOpenMenuIndex}
                openWeightUnitMenuIndex={openWeightUnitMenuIndex}
                setOpenWeightUnitMenuIndex={setOpenWeightUnitMenuIndex}
                onSetExpirationItem={onSetExpirationItem}
              />
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
            <TextInput
              placeholder="Comment"
              defaultValue={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              mode="outlined"
              style={styles.input}
            />
            <View style={styles.buttonContainer}>
              <Button 
                mode="contained" 
                onPress={onSave} 
                style={styles.buttonWrapper}
              >
                Save
              </Button>
              <Button 
                mode="outlined" 
                onPress={onCancel} 
                style={styles.buttonWrapper}
              >
                Cancel
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={expirationDatePickerVisible}
        onDismiss={handleDismissExpirationDatePicker}
        date={
          expirationItemIndex !== null && editItems[expirationItemIndex].expirationDate 
            ? new Date(editItems[expirationItemIndex].expirationDate)
            : new Date()
        }
        onConfirm={handleConfirmExpirationDate}
      />
    </Portal>
  );
};

const styles = StyleSheet.create({
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
  divider: {
    marginVertical: 10,
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

export default DonationEditModal;