import React, { useState } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { Modal, TextInput, Button, withTheme } from "react-native-paper";
import { useEvents } from "@/components/providers/EventsProvider";

interface NewEventModalProps {
  visible: boolean;
  onClose: () => void;
}

function NewEventModal({ visible, onClose }: NewEventModalProps) {
  const { addEvent } = useEvents();

  const [title, setTitle] = useState("");
  const [hour, setHour] = useState("");
  const [duration, setDuration] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");

  const handleAddEvent = () => {
    if (!title || !date || !hour || !duration) {
      alert("Please fill all required fields.");
      return;
    }

    addEvent(date, { title, hour, duration, description, date });
    onClose();

    // Reset inputs
    setTitle("");
    setHour("");
    setDuration("");
    setDescription("");
    setDate("");
  };

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
        <Button mode="contained" onPress={handleAddEvent}>
          Add Event
        </Button>
      </KeyboardAvoidingView>
    </Modal>
  );
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
});

export default NewEventModal;
