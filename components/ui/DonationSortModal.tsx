// DonationSortModal.tsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Modal, Portal, Title, Button } from 'react-native-paper';

interface DonationSortModalProps {
  visible: boolean;
  onDismiss: () => void;
  sortOption: string;
  setSortOption: (option: string) => void;
}

const DonationSortModal: React.FC<DonationSortModalProps> = ({
  visible,
  onDismiss,
  sortOption,
  setSortOption,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContentWrapper}
      >
        <Title style={styles.modalTitle}>Sort Donations</Title>
        <Button 
          mode="contained" 
          onPress={() => { setSortOption('recent'); onDismiss(); }}
          style={{ marginBottom: 10 }}
        >
          Most Recently Created
        </Button>
        <Button 
          mode="contained" 
          onPress={() => { setSortOption('weight'); onDismiss(); }}
          style={{ marginBottom: 10 }}
        >
          Weight
        </Button>
        <Button 
          mode="contained" 
          onPress={() => { setSortOption('expiration'); onDismiss(); }}
        >
          Expiration Date
        </Button>
      </Modal>
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
});

export default DonationSortModal;