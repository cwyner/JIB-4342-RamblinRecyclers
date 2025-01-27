import React from "react";
import { FAB } from "react-native-paper";
import { StyleSheet } from "react-native";

interface FloatingButtonProps {
  onPress: () => void;
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