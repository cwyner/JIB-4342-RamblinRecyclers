import React, { useState } from "react"
import { StyleSheet, KeyboardAvoidingView, Platform } from "react-native"
import {
  Modal,
  TextInput,
  Button,
  withTheme,
  HelperText,
} from "react-native-paper"
import { TimePickerModal, DatePickerModal } from "react-native-paper-dates"
import { useEvents } from "@/components/providers/EventsProvider"

interface NewEventModalProps {
  visible: boolean
  onClose: () => void
}

function NewEventModal({ visible, onClose }: NewEventModalProps) {
  const { addEvent } = useEvents()

  const [title, setTitle] = useState("")
  const [hour, setHour] = useState("")
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [team, setTeam] = useState("")

  const [openTimePicker, setOpenTimePicker] = useState(false)
  const [openDatePicker, setOpenDatePicker] = useState(false)

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
        <Button
          mode="outlined"
          onPress={() => setOpenDatePicker(true)}
          style={styles.input}
        >
          {date ? `Date: ${date}` : "Select Date"}
        </Button>
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

      <TimePickerModal
        visible={openTimePicker}
        onDismiss={() => setOpenTimePicker(false)}
        onConfirm={({ hours, minutes }) => {
          setHour(formatTime(hours, minutes))
          setOpenTimePicker(false)
        }}
        hours={0}
        minutes={0}
        label="Select time"
        uppercase={false}
      />

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
