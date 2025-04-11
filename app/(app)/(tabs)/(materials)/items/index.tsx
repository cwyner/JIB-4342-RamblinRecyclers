import React, { FC, useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Text, Card, Title, Paragraph, Avatar, IconButton, Divider } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot, getFirestore } from "firebase/firestore";
import { getApp } from "firebase/app";
import type { Donation } from "@/components/ui/DonationCard";
import { Svg, Path } from "react-native-svg";

const windowWidth = Dimensions.get("window").width;

const ItemPage: FC = () => {
  const { donationId, idx } = useLocalSearchParams();
  const [donationItems, setDonationItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  // currentIndex is based on the initial idx value, defaulting to 0
  const initialIndex = parseInt(idx as string, 10) || 0;
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!donationId) {
      setError("Missing donationId.");
      return;
    }
    const db = getFirestore(getApp());
    const donationRef = doc(db, "donations", donationId as string);

    const unsubscribe = onSnapshot(
      donationRef,
      (donationSnapshot) => {
        if (donationSnapshot.exists()) {
          const data = donationSnapshot.data() as Donation;
          if (data.items && Array.isArray(data.items)) {
            setDonationItems(data.items);
            setError(null);
            // Scroll to initial index after items are loaded
            setTimeout(() => {
              scrollViewRef.current?.scrollTo({ x: initialIndex * windowWidth, animated: false });
            }, 100);
          } else {
            setError("No items found in donation.");
          }
        } else {
          setError("Donation not found.");
        }
      },
      (err) => {
        console.error("Error fetching snapshot: ", err);
        setError("Error fetching donation.");
      }
    );

    return () => unsubscribe();
  }, [donationId]);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / windowWidth);
    setCurrentIndex(newIndex);
  };

  const ItemIcon = () => (
    <Svg width="40" height="40" viewBox="0 0 24 24">
      <Path fill="#6200ee" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-4h2v4z"/>
    </Svg>
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (donationItems.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>Loading items...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.outerContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.contentContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          contentContainerStyle={styles.innerContainer}
        >
          {donationItems.map((item, index) => (
            <View key={index} style={styles.cardContainer}>
              <Card style={styles.card}>
                <Card.Title
                  title={item.description || "Item Details"}
                  subtitle={`Quantity: ${item.quantity}`}
                  left={(props) => (
                    <Avatar.Icon {...props} icon="recycle-variant" style={{ backgroundColor: "#6200ee" }} />
                  )}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon="pencil"
                      onPress={() => {
                        // to be implemented
                      }}
                    />
                  )}
                />
                <Card.Content>
                  <View style={styles.iconContainer}>
                    <ItemIcon />
                  </View>
                  <Title style={styles.itemTitle}>{item.description}</Title>
                  <Paragraph style={styles.paragraph}>
                    <Text style={styles.label}>Quantity: </Text>
                    {item.quantity}
                  </Paragraph>
                  {item.weight ? (
                    <Paragraph style={styles.paragraph}>
                      <Text style={styles.label}>Weight: </Text>
                      {item.weight} {item.weightUnit || ""}
                    </Paragraph>
                  ) : null}
                  {item.status ? (
                    <Paragraph style={styles.paragraph}>
                      <Text style={styles.label}>Status: </Text>
                      {item.status}
                    </Paragraph>
                  ) : null}
                  {item.expirationDate ? (
                    <Paragraph style={styles.paragraph}>
                      <Text style={styles.label}>Expires: </Text>
                      {item.expirationDate}
                    </Paragraph>
                  ) : null}
                </Card.Content>
                <Divider style={styles.divider} />
                <Card.Actions style={styles.actions}>
                  <IconButton
                    icon="share-variant"
                    size={24}
                    onPress={() => {
                      // to be implemented
                    }}
                  />
                  <IconButton
                    icon="delete"
                    size={24}
                    onPress={() => {
                      // to be implemented
                    }}
                  />
                </Card.Actions>
              </Card>
            </View>
          ))}
        </ScrollView>
        {/* Pagination indicator directly under the card */}
        <View style={styles.pagination}>
          {donationItems.map((_, index) => (
            <View key={index} style={[styles.dot, currentIndex === index ? styles.activeDot : {}]} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingVertical: 20,
  },
  contentContainer: {
    alignItems: "center",
  },
  innerContainer: {
    alignItems: "center",
  },
  cardContainer: {
    width: windowWidth,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: windowWidth - 40,
    borderRadius: 12,
    elevation: 3,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  itemTitle: {
    marginTop: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  paragraph: {
    marginVertical: 5,
    fontSize: 16,
  },
  label: {
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 10,
  },
  actions: {
    justifyContent: "flex-end",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#6200ee",
  },
});

export default ItemPage;
