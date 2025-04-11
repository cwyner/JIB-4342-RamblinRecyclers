// DonationFilterModal.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, Portal, Title, Button, Menu } from 'react-native-paper';

interface DonationFilterModalProps {
  visible: boolean;
  onDismiss: () => void;
  filterMethod: string;
  setFilterMethod: (value: string) => void;
  filterMaterialStatus: string;
  setFilterMaterialStatus: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
}

const DonationFilterModal: React.FC<DonationFilterModalProps> = ({
  visible,
  onDismiss,
  filterMethod,
  setFilterMethod,
  filterMaterialStatus,
  setFilterMaterialStatus,
  filterCategory,
  setFilterCategory,
}) => {
  const [filterMethodMenuVisible, setFilterMethodMenuVisible] = React.useState(false);
  const [filterMaterialStatusMenuVisible, setFilterMaterialStatusMenuVisible] = React.useState(false);
  const [filterCategoryMenuVisible, setFilterCategoryMenuVisible] = React.useState(false);

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContentWrapper}
      >
        <Title style={styles.modalTitle}>Filter Donations</Title>
        <Menu
          visible={filterMethodMenuVisible}
          onDismiss={() => setFilterMethodMenuVisible(false)}
          anchor={
            <Button style={{ marginBottom: 10 }} mode="outlined" onPress={() => setFilterMethodMenuVisible(true)}>
              {filterMethod ? filterMethod : "Select Method"}
            </Button>
          }
        >
          <Menu.Item 
            onPress={() => { setFilterMethod("📦 Drop Off"); setFilterMethodMenuVisible(false); }} 
            title="📦 Drop Off" 
          />
          <Menu.Item 
            onPress={() => { setFilterMethod("🚚 Pick Up"); setFilterMethodMenuVisible(false); }} 
            title="🚚 Pick Up" 
          />
          <Menu.Item 
            onPress={() => { setFilterMethod("🗓️ Event"); setFilterMethodMenuVisible(false); }} 
            title="🗓️ Event" 
          />
        </Menu>
        <Menu
          visible={filterMaterialStatusMenuVisible}
          onDismiss={() => setFilterMaterialStatusMenuVisible(false)}
          anchor={
            <Button style={{ marginBottom: 10 }} mode="outlined" onPress={() => setFilterMaterialStatusMenuVisible(true)}>
              {filterMaterialStatus ? filterMaterialStatus : "Select Material Status"}
            </Button>
          }
        >
          <Menu.Item 
            onPress={() => { setFilterMaterialStatus("Received"); setFilterMaterialStatusMenuVisible(false); }} 
            title="Received" 
          />
          <Menu.Item 
            onPress={() => { setFilterMaterialStatus("Refurbishing"); setFilterMaterialStatusMenuVisible(false); }} 
            title="Refurbishing" 
          />
          <Menu.Item 
            onPress={() => { setFilterMaterialStatus("Refurbished"); setFilterMaterialStatusMenuVisible(false); }} 
            title="Refurbished" 
          />
          <Menu.Item 
            onPress={() => { setFilterMaterialStatus("Awaiting"); setFilterMaterialStatusMenuVisible(false); }} 
            title="Awaiting" 
          />
        </Menu>
        <Menu
          visible={filterCategoryMenuVisible}
          onDismiss={() => setFilterCategoryMenuVisible(false)}
          anchor={
            <Button style={{ marginBottom: 10 }} mode="outlined" onPress={() => setFilterCategoryMenuVisible(true)}>
              {filterCategory ? filterCategory : "Select Category"}
            </Button>
          }
        >
          <Menu.Item 
            onPress={() => { setFilterCategory("Wood"); setFilterCategoryMenuVisible(false); }} 
            title="🪵 Wood" 
          />
          <Menu.Item 
            onPress={() => { setFilterCategory("Metals"); setFilterCategoryMenuVisible(false); }} 
            title="🔩 Metals" 
          />
          <Menu.Item 
            onPress={() => { setFilterCategory("Textiles"); setFilterCategoryMenuVisible(false); }} 
            title="🧵 Textiles" 
          />
        </Menu>
        <View style={styles.buttonContainer}>
          <Button mode="contained" onPress={onDismiss}>
            Apply Filters
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => {
              setFilterMethod('');
              setFilterMaterialStatus('');
              setFilterCategory('');
              onDismiss();
            }}
          >
            Clear Filters
          </Button>
        </View>
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default DonationFilterModal;