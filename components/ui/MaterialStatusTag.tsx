import type { FC } from "react"
import { Text, StyleSheet } from "react-native"

interface MaterialStatusTagProps {
  name: "Received" | "Refurbishing" | "Refurbished"
}

export const MaterialStatusTag: FC<MaterialStatusTagProps> = ({ name }) => {
  return (
    <Text style={
      [
        styles.container,
        name == "Received" ? styles.received :
        name == "Refurbishing" ? styles.inProgress :
        name == "Refurbished" ? styles.success : ""
      ]
    } >
      {name}
    </Text>
  )
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 10,
    top: 10,
    fontSize: 10,
    borderRadius: "10%",
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  success: {
    backgroundColor: "#4BB543",
  },
  inProgress: {
    backgroundColor: "#f5e617",
  },
  received: {
    backgroundColor: "#1e90ff",
  }
})