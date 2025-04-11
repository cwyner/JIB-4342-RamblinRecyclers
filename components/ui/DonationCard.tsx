// DonationCard.tsx
import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Card, Text, Divider, IconButton } from 'react-native-paper';
import { getEmojiForCategory } from './utils';
import { MaterialStatusTag } from './MaterialStatusTag';

export interface Item {
  description: string;
  quantity: string;
  weight?: string;
  weightUnit?: string;
  status: "Received" | "Refurbishing" | "Refurbished" | "Awaiting";
  materialCategory?: string;
  expirationDate?: string;
}

export interface Donation {
  id: string;
  donorName?: string;
  email?: string;
  comment?: string;
  donationDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  method?: string;
  selectedDate?: string;
  selectedTime?: string;
  itemDescription?: string;
  quantity?: string;
  weight?: string;
  weightUnit?: string;
  status?: string;
  materialCategory?: string;
  expirationDate?: string;
  items?: Item[];
}

interface DonationCardProps {
  donation: Donation;
  openDonationModal: (donation: Donation) => void;
  handleDownloadReceipt: (donation: Donation) => void;
  openGoogleMaps: (donation: Donation) => void;
  handleDeleteDonation: (donation: Donation) => void;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation, openDonationModal, handleDownloadReceipt, openGoogleMaps, handleDeleteDonation }) => {
  return (
    <Card style={styles.card} onPress={() => openDonationModal(donation)}>
      <Card.Content>
        {donation.items && Array.isArray(donation.items) ? (
          donation.items.map((itm: Item, idx: number) => (
            <View key={idx} style={styles.donationItemContainer}>
              <View style={styles.itemRow}>
                <Text style={styles.itemText}>
                  {idx + 1}. {itm.description} - {itm.quantity}{' '}
                </Text>
                <MaterialStatusTag name={itm.status || "Awaiting"} />
              </View>
              {itm.materialCategory ? (
                <Text style={styles.categoryText}>
                  {getEmojiForCategory(itm.materialCategory)} {itm.materialCategory}
                </Text>
              ) : null}
              {itm.expirationDate ? (
                <Text style={styles.categoryText}>
                  Expires: {itm.expirationDate}
                </Text>
              ) : null}
              {itm.weight ? (
                <Text style={styles.categoryText}>
                  Weight: {itm.weight} {itm.weightUnit} per unit
                </Text>
              ) : null}
            </View>
          ))
        ) : (
          <View style={styles.donationItemContainer}>
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>
                {donation.itemDescription}
              </Text>
              <MaterialStatusTag name={donation.status || "Awaiting"} />
            </View>
            <Text style={styles.subText}>Quantity: {donation.quantity || 'Unknown'}</Text>
            {donation.weight ? (
              <Text style={styles.subText}>
                Weight: {donation.weight} {donation.weightUnit || 'lbs'}
              </Text>
            ) : null}
            {donation.materialCategory ? (
              <Text style={styles.categoryText}>
                {getEmojiForCategory(donation.materialCategory)} {donation.materialCategory}
              </Text>
            ) : null}
            {donation.expirationDate ? (
              <Text style={styles.categoryText}>
                Expires: {donation.expirationDate}
              </Text>
            ) : null}
          </View>
        )}
        <Divider style={styles.divider} />
        <Text style={styles.subText}>Donor: {donation.donorName || 'Unknown'}</Text>
        <Text style={styles.subText}>Comment: {donation.comment || 'No comments'}</Text>
        {donation.address && <Text style={styles.subText}>Address: {donation.address}</Text>}
        {donation.city && <Text style={styles.subText}>City: {donation.city}</Text>}
        {donation.state && <Text style={styles.subText}>State: {donation.state}</Text>}
        {donation.zipcode && <Text style={styles.subText}>Zipcode: {donation.zipcode}</Text>}
        {donation.selectedDate && <Text style={styles.subText}>Date: {donation.selectedDate}</Text>}
        {donation.selectedTime && <Text style={styles.subText}>Time: {donation.selectedTime}</Text>}
        {donation.method && <Text style={{ marginTop: 10 }}>{donation.method}</Text>}
      </Card.Content>
      <Card.Actions>
        <IconButton 
          icon="delete" 
          onPress={() => handleDeleteDonation(donation)}
        />
        <IconButton 
          icon="download" 
          onPress={() => handleDownloadReceipt(donation)} 
        />
        {donation.address && (
          <IconButton 
            icon="map" 
            onPress={() => openGoogleMaps(donation)}
          />
        )}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 10,
    elevation: 3,
    backgroundColor: '#fff',
  },
  donationItemContainer: {
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    color: '#444',
  },
  categoryText: {
    fontSize: 12,
    color: '#555',
    marginTop: 4,
    marginLeft: 4,
  },
  subText: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  divider: {
    marginVertical: 10,
  },
});

export default DonationCard;