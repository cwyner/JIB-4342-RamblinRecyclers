import React from "react";
import { FAB } from "react-native-paper";
import { StyleSheet } from "react-native";

interface FloatingButtonProps {
  onPress: () => void;
}

function FloatingButton({ onPress }: FloatingButtonProps) {
  return (
    <FAB
      style={styles.fab}
      icon="plus"
      onPress={onPress}
    />
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#6200ee",
  },
});

export default FloatingButton;