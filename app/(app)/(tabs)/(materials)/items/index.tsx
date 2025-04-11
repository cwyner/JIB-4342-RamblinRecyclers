import React, { FC, useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView, Dimensions, Pressable, Alert, Image } from "react-native";
import { Text, Card, Avatar, IconButton, Divider } from "react-native-paper";
import { useLocalSearchParams } from "expo-router";
import { doc, onSnapshot, getFirestore, updateDoc } from "firebase/firestore";
import { getApp } from "firebase/app";
import type { Donation } from "@/components/ui/DonationCard";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";

const windowWidth = Dimensions.get("window").width;

const ItemPage: FC = () => {
  const { donationId, idx } = useLocalSearchParams();
  const [donationItems, setDonationItems] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const initialIndex = parseInt(idx as string, 10) || 0;
  const [currentIndex, setCurrentIndex] = useState<number>(initialIndex);
  const scrollViewRef = useRef<ScrollView>(null);

  const uploadImage = async (cardIndex: number, localUri: string): Promise<string> => {
    const storage = getStorage(getApp());
    const filename = `donationImages/${donationId}_${cardIndex}_${Date.now()}.jpg`;
    const imgRef = storageRef(storage, filename);
    const response = await fetch(localUri);
    const blob = await response.blob();
    await uploadBytes(imgRef, blob);
    const downloadURL = await getDownloadURL(imgRef);
    return downloadURL;
  };

  const handleCameraPress = async (cardIndex: number) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Camera permission is required to take a photo.");
      return;
    }
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    if (!result.canceled) {
      const localUri = result.assets[0].uri;
      const updatedItems = [...donationItems];
      updatedItems[cardIndex] = { ...updatedItems[cardIndex], imageUri: localUri };
      setDonationItems(updatedItems);
      
      try {
        const downloadURL = await uploadImage(cardIndex, localUri);
        const db = getFirestore(getApp());
        const donationRef = doc(db, "donations", donationId as string);
        updatedItems[cardIndex] = { ...updatedItems[cardIndex], imageUri: downloadURL };
        await updateDoc(donationRef, { items: updatedItems });
        setDonationItems(updatedItems);
        Alert.alert("Success", "Image uploaded and saved!");
      } catch (err) {
        console.error("Error uploading image: ", err);
        Alert.alert("Error", "There was an error uploading the image. The captured image will still be displayed locally.");
      }
    }
  };

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
    <ScrollView contentContainerStyle={styles.outerContainer} showsVerticalScrollIndicator={false}>
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
                        // Editing functionality placeholder.
                      }}
                    />
                  )}
                />
                <Card.Content>
                  {item.imageUri ? (
                    // Display the image if available.
                    <Pressable onPress={() => handleCameraPress(index)} style={styles.cameraContainer}>
                      <Image source={{ uri: item.imageUri }} style={styles.previewImage} />
                    </Pressable>
                  ) : (
                    // Otherwise, show the camera button.
                    <Pressable onPress={() => handleCameraPress(index)} style={styles.cameraContainer}>
                      <IconButton icon="camera" size={50} />
                    </Pressable>
                  )}
                  <Text>Quantity: {item.quantity}</Text>
                  {item.weight && <Text>Weight: {item.weight} {item.weightUnit || ""}</Text>}
                  {item.status && <Text>Status: {item.status}</Text>}
                  {item.expirationDate && <Text>Expires: {item.expirationDate}</Text>}
                </Card.Content>
                <Divider style={styles.divider} />
                <Card.Actions style={styles.actions}>
                  <IconButton
                    icon="share-variant"
                    size={24}
                    onPress={() => {
                      // Placeholder for share functionality.
                    }}
                  />
                  <IconButton
                    icon="delete"
                    size={24}
                    onPress={() => {
                      // Placeholder for delete functionality.
                    }}
                  />
                </Card.Actions>
              </Card>
            </View>
          ))}
        </ScrollView>
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
  cameraContainer: {
    width: 200,
    height: 200,
    borderWidth: 2,
    borderColor: "#6200ee",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  divider: {
    marginVertical: 10,
  },
  actions: {
    justifyContent: "space-evenly",
    width: "100%",
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