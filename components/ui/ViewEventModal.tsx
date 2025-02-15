import React, { useState } from "react"
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import { Modal, TextInput, Button } from "react-native-paper"
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates"
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

  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [openTimePicker, setOpenTimePicker] = useState(false)

  const formatTime = (hours: number, minutes: number) => {
    const period = hours >= 12 ? "PM" : "AM"
    const hour12 = hours % 12 === 0 ? 12 : hours % 12
    return `${hour12}:${minutes < 10 ? "0" : ""}${minutes} ${period}`
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
  }

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
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />

        <Button mode="outlined" onPress={() => setOpenDatePicker(true)} style={styles.input}>
          {date ? `Date: ${date}` : "Select Date"}
        </Button>

        <Button mode="outlined" onPress={() => setOpenTimePicker(true)} style={styles.input}>
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

        <Button mode="contained" onPress={handleUpdate}>
          Update Event
        </Button>
        <Button mode="text" onPress={handleDelete} color="red">
          Delete Event
        </Button>
      </KeyboardAvoidingView>

      <DatePickerModal
        locale="en"
        mode="single"
        visible={openDatePicker}
        onDismiss={() => setOpenDatePicker(false)}
        date={date ? new Date(date) : new Date()}
        onConfirm={({ date: selectedDate }) => {
          setDate(formatDate(selectedDate))
          setOpenDatePicker(false)
        }}
      />

      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={({ hours, minutes }) => {
          setHour(formatTime(hours, minutes))
          setOpenTimePicker(false)
        }}
        hours={0}
        minutes={0}
        label="Select Time"
        uppercase={false}
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

export default ViewEventModal