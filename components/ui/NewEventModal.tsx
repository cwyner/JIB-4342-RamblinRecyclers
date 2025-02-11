import React, { useState } from "react"
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import {
  Modal,
  TextInput,
  Button,
  withTheme,
  HelperText,
} from "react-native-paper"
import { TimePickerModal } from "react-native-paper-dates"
import { useEvents } from "@/components/providers/EventsProvider"

interface NewEventModalProps {
  visible: boolean
  onClose: () => void
}

function NewEventModal({ visible, onClose }: NewEventModalProps) {
  const { addEvent } = useEvents()

  const [title, setTitle] = useState("")
  // We'll remove the plain text hour input and use the time picker instead.
  const [hour, setHour] = useState("")
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [team, setTeam] = useState("")

  // State to control the visibility of the time picker modal.
  const [openTimePicker, setOpenTimePicker] = useState(false)

  // Helper to format the time into a string (e.g., "9:00 AM").
  const formatTime = (hours: number, minutes: number) => {
    const period = hours >= 12 ? "PM" : "AM"
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    return `${hour12}:${minutes < 10 ? "0" : ""}${minutes} ${period}`
  }

  const handleAddEvent = () => {
    if (!title || !date || !hour || !duration) {
      alert("Please fill all required fields.")
      return
    }

    addEvent(date, {
      title,
      hour,
      duration,
      description,
      date,
      team,
    })

    onClose()

    // Reset all fields
    setTitle("")
    setHour("")
    setDuration("")
    setDescription("")
    setDate("")
    setTeam("")
  }

  return (
    <Modal
      visible={visible}
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

        {/* Replace the plain "Hour" input with a button that shows the time picker */}
        <Button
          mode="outlined"
          onPress={() => setOpenTimePicker(true)}
          style={styles.input}
        >
          {hour ? `Time: ${hour}` : "Select Time"}
        </Button>

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

        <TextInput
          label="Team"
          placeholder="Team name or ID"
          value={team}
          onChangeText={setTeam}
          style={styles.input}
          mode="outlined"
        />

        <HelperText type="info" visible={true}>
          Optional: Assign this event to a specific team.
        </HelperText>

        <Button mode="contained" onPress={handleAddEvent}>
          Add Event
        </Button>
      </KeyboardAvoidingView>

      {/* Time Picker Modal from react-native-paper-dates */}
      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={({ hours, minutes }) => {
          // Format the chosen time and store it in state.
          setHour(formatTime(hours, minutes))
          setOpenTimePicker(false)
        }}
        hours={0} // default hour (optional)
        minutes={0} // default minute (optional)
        label="Select time" // optional
        uppercase={false} // optional, controls the text style of the action buttons
      />
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

export default withTheme(NewEventModal)
