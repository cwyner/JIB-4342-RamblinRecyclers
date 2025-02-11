import React, { useState } from "react"
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { Modal, TextInput, Button } from "react-native-paper"
import { useEvents } from "@/components/providers/EventsProvider"

interface ViewEventModalProps {
  event: any
  onClose: () => void
}

function ViewEventModal({ event, onClose }: ViewEventModalProps) {
  const { removeEvent, addEvent } = useEvents()

  const [title, setTitle] = useState(event.title || "")
  const [hour, setHour] = useState(event.hour || "")
  const [duration, setDuration] = useState(event.duration || "")
  const [description, setDescription] = useState(event.description || "")
  const [date, setDate] = useState(event.date || "")

  const handleDelete = () => {
    if (date && title) {
      removeEvent(date, title)
    } else {
      console.error("Error: Date or title is missing when deleting an event.")
    }
    onClose()
  }

  const handleUpdate = async () => {
    if (!title || !date || !hour || !duration) {
      alert("Please fill all required fields.")
      return
    }

    await removeEvent(event.date, event.title)
    await addEvent(date, { title, hour, duration, description, date })
    onClose()
  }

  return (
    <Modal
      visible={true}
      onDismiss={onClose}
      contentContainerStyle={styles.modalContainer}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Date (YYYY-MM-DD)"
          value={date}
          onChangeText={setDate}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Hour (e.g., 9am)"
          value={hour}
          onChangeText={setHour}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Duration (e.g., 1h)"
          value={duration}
          onChangeText={setDuration}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          mode="outlined"
          multiline
        />
        <Button mode="contained" onPress={handleUpdate}>
          Update Event
        </Button>
        <Button mode="text" onPress={handleDelete} color="red">
          Delete Event
        </Button>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
  },
})

export default ViewEventModal
