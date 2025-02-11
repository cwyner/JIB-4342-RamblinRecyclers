import React from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"

interface AgendaItemProps {
  item: any
  onPress: () => void
}

function AgendaItem({ item, onPress }: AgendaItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemHour}>{item.hour}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemHour: {
    fontSize: 14,
    color: "#666",
  },
})

export default AgendaItem
