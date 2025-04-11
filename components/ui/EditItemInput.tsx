// EditItemInput.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput, IconButton, Button, Menu, Divider } from 'react-native-paper';
import { MaterialStatusTag } from './MaterialStatusTag';
import { getEmojiForCategory } from './utils';

export interface Item {
  description: string;
  quantity: string;
  weight?: string;
  weightUnit?: string;
  status: "Received" | "Refurbishing" | "Refurbished" | "Awaiting";
  materialCategory?: string;
  expirationDate?: string;
}

interface EditItemInputProps {
  item: Item;
  index: number;
  handleEditItemChange: (index: number, key: keyof Item, value: string) => void;
  handleRemoveEditItem: (index: number) => void;
  openMenuIndex: number | null;
  setOpenMenuIndex: (index: number | null) => void;
  openWeightUnitMenuIndex: number | null;
  setOpenWeightUnitMenuIndex: (index: number | null) => void;
  onSetExpirationItem: (index: number) => void;
}

const EditItemInput: React.FC<EditItemInputProps> = React.memo(({
  item,
  index,
  handleEditItemChange,
  handleRemoveEditItem,
  openMenuIndex,
  setOpenMenuIndex,
  openWeightUnitMenuIndex,
  setOpenWeightUnitMenuIndex,
  onSetExpirationItem,
}) => {
  return (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginRight: 10, ...styles.itemLabel }}>Item {index + 1}</Text>
          <MaterialStatusTag 
            name={item.status || "Awaiting"} 
            onStatusChange={(newStatus) => 
              handleEditItemChange(index, 'status', newStatus)
            }
          />
        </View>
        <IconButton 
          icon="delete" 
          size={20} 
          onPress={() => handleRemoveEditItem(index)} 
        />
      </View>
      <Divider style={styles.divider} />
      <TextInput
        placeholder="Item Description"
        defaultValue={item.description}
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
      <View style={{ flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          placeholder="Weight"
          defaultValue={item.weight}
          onChangeText={(text) => handleEditItemChange(index, 'weight', text)}
          keyboardType="numeric"
          mode="outlined"
          style={[styles.input, { flex: 1 }]}
        />
        <Menu
          visible={openWeightUnitMenuIndex === index}
          onDismiss={() => setOpenWeightUnitMenuIndex(null)}
          anchor={
            <Button 
              mode="outlined" 
              onPress={() => setOpenWeightUnitMenuIndex(index)}
              style={{ justifyContent: "center", marginLeft: 8, borderRadius: 3, height: 54, marginBottom: 13}}
            >
              <Text>
                {item.weightUnit || 'lbs'}
              </Text>
            </Button>
          }
        >
          <Menu.Item 
            onPress={() => { 
              handleEditItemChange(index, 'weightUnit', 'lbs'); 
              setOpenWeightUnitMenuIndex(null);
            }} 
            title="lbs" 
          />
          <Menu.Item 
            onPress={() => { 
              handleEditItemChange(index, 'weightUnit', 'kg'); 
              setOpenWeightUnitMenuIndex(null);
            }} 
            title="kg" 
          />
        </Menu>
      </View>
      <Menu
        visible={openMenuIndex === index}
        onDismiss={() => setOpenMenuIndex(null)}
        anchor={
          <Button mode="outlined" onPress={() => setOpenMenuIndex(index)}>
            {item.materialCategory 
              ? `${getEmojiForCategory(item.materialCategory)} ${item.materialCategory}` 
              : "Select Category"}
          </Button>
        }
      >
        <Menu.Item 
          onPress={() => { handleEditItemChange(index, 'materialCategory', 'Wood'); setOpenMenuIndex(null); }} 
          title="🪵 Wood" 
        />
        <Menu.Item 
          onPress={() => { handleEditItemChange(index, 'materialCategory', 'Metals'); setOpenMenuIndex(null); }} 
          title="🔩 Metals" 
        />
        <Menu.Item 
          onPress={() => { handleEditItemChange(index, 'materialCategory', 'Textiles'); setOpenMenuIndex(null); }} 
          title="🧵 Textiles" 
        />
      </Menu>
      <Button 
        mode="outlined" 
        onPress={() => onSetExpirationItem(index)}
        style={{ marginTop: 8 }}
      >
        {item.expirationDate ? `Expires: ${item.expirationDate}` : "Set Expiration Date"}
      </Button>
    </View>
  );
});

const styles = StyleSheet.create({
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
  divider: {
    marginVertical: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
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
});

export default EditItemInput;