import React, { useState, FC } from "react";
import { Text, StyleSheet, TouchableOpacity, View } from "react-native";
import { Menu } from "react-native-paper";

interface MaterialStatusTagProps {
  name: "Received" | "Refurbishing" | "Refurbished" | "Awaiting";
  onStatusChange?: (newStatus: "Received" | "Refurbishing" | "Refurbished" | "Awaiting") => void;
}

export const MaterialStatusTag: FC<MaterialStatusTagProps> = ({ name, onStatusChange }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleStatusChange = (status: "Received" | "Refurbishing" | "Refurbished" | "Awaiting") => {
    closeMenu();
    if (onStatusChange) {
      onStatusChange(status);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <TouchableOpacity onPress={openMenu}>
            <Text style={[
              styles.container,
              name === "Received" ? styles.received :
              name === "Refurbishing" ? styles.inProgress :
              name === "Awaiting" ? styles.awaiting :
              name === "Refurbished" ? styles.success : null
            ]}>
              {name}
            </Text>
          </TouchableOpacity>
        }
      >
        <Menu.Item onPress={() => handleStatusChange("Received")} title="Received" />
        <Menu.Item onPress={() => handleStatusChange("Refurbishing")} title="Refurbishing" />
        <Menu.Item onPress={() => handleStatusChange("Refurbished")} title="Refurbished" />
        <Menu.Item onPress={() => handleStatusChange("Awaiting")} title="Awaiting" />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    // This wrapper helps with positioning the Menu relative to the text.
  },
  container: {
    fontSize: 10,
    borderRadius: "10%",
    paddingVertical: 2,
    paddingHorizontal: 6
  },
  success: {
    backgroundColor: "#4BB543",
  },
  inProgress: {
    backgroundColor: "#f5e617",
  },
  received: {
    backgroundColor: "#1e90ff",
  },
  awaiting: {
    backgroundColor: "#87CEEB",
  }
});
