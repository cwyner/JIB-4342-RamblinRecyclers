import React from "react"
import { TouchableOpacity, View, Text, StyleSheet } from "react-native"
import { Checkbox } from "react-native-paper"

interface AgendaItemProps {
  item: any
  onPress: () => void
  onToggleComplete: (id: string | number, newStatus: boolean) => void
}

function AgendaItem({ item, onPress, onToggleComplete }: AgendaItemProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <Checkbox
        status={item.completed ? "checked" : "unchecked"}
        onPress={() => onToggleComplete(item.id, !item.completed)}
      />
      <Text style={styles.itemTitle}>{item.title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  itemHour: {
    fontSize: 14,
    color: "#666",
  },
})

export default AgendaItem
