import React, { useState, useMemo, useEffect } from "react"
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  View,
} from "react-native"
import {
  Portal,
  Modal,
  TextInput,
  Button,
  HelperText,
  List,
  ActivityIndicator,
  withTheme,
} from "react-native-paper"
import { TimePickerModal, DatePickerModal } from "react-native-paper-dates"
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore"
import debounce from "lodash.debounce"
import { useEvents } from "@/components/providers/EventsProvider"

interface NewEventModalProps {
  visible: boolean
  onClose: () => void
}

export default withTheme(function NewEventModal({
  visible,
  onClose,
}: NewEventModalProps) {
  const { addEvent } = useEvents()
  const db = getFirestore()

  const [title, setTitle] = useState("")
  const [hour, setHour] = useState("")
  const [duration, setDuration] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [team, setTeam] = useState("")
  const [searchResults, setSearchResults] = useState<{ id: string; name: string }[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  const [openTimePicker, setOpenTimePicker] = useState(false)
  const [openDatePicker, setOpenDatePicker] = useState(false)

  const formatTime = (h: number, m: number) => {
    const period = h >= 12 ? "PM" : "AM"
    const hour12 = h % 12 === 0 ? 12 : h % 12
    return `${hour12}:${m < 10 ? "0" : ""}${m} ${period}`
  }

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`

  // Debounced Firestore lookup: if text is empty, fetch all teams
  const searchTeams = useMemo(
    () =>
      debounce(async (text: string) => {
        setSearchLoading(true)
        try {
          let snap: QuerySnapshot<DocumentData>
          if (!text.trim()) {
            snap = await getDocs(collection(db, "teams"))
          } else {
            const q = query(
              collection(db, "teams"),
              where("name", ">=", text),
              where("name", "<=", text + "\uf8ff")
            )
            snap = await getDocs(q)
          }
          const results: { id: string; name: string }[] = []
          snap.forEach((doc) => {
            const data = doc.data() as { name: string }
            results.push({ id: doc.id, name: data.name })
          })
          setSearchResults(results)
        } catch (err) {
          console.error("Team search failed:", err)
        } finally {
          setSearchLoading(false)
        }
      }, 500),
    [db]
  )

  useEffect(() => {
    return () => {
      searchTeams.cancel()
    }
  }, [searchTeams])

  const onChangeTeam = (text: string) => {
    setTeam(text)
    searchTeams(text)
  }

  const handleSelectTeam = (item: { id: string; name: string }) => {
    setTeam(item.name)
    setSearchResults([])
  }

  const handleAddEvent = () => {
    if (!title || !date || !hour || !duration) {
      alert("Please fill all required fields.")
      return
    }
    addEvent(date, { title, hour, duration, description, date, team })
    onClose()
    setTitle("")
    setHour("")
    setDuration("")
    setDescription("")
    setDate("")
    setTeam("")
    setSearchResults([])
  }

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modal}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 60 : 0}
        >
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Duration (e.g., 1h)"
            value={duration}
            onChangeText={setDuration}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            style={styles.input}
          />

          {/* Team input + attached dropdown */}
          <View style={styles.dropdownWrapper}>
            <TextInput
              label="Team"
              placeholder="Search by name"
              value={team}
              onChangeText={onChangeTeam}
              mode="outlined"
            />

            {(searchLoading || searchResults.length > 0) && (
              <View style={styles.dropdown}>
                {searchLoading ? (
                  <ActivityIndicator size="small" style={styles.loading} />
                ) : (
                  <FlatList
                    data={searchResults}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <List.Item
                        title={item.name}
                        onPress={() => handleSelectTeam(item)}
                      />
                    )}
                  />
                )}
              </View>
            )}
          </View>

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

          <HelperText type="info" visible>
            Optional: assign this event to a team.
          </HelperText>

          <Button mode="contained" onPress={handleAddEvent} style={styles.addButton}>
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
          onConfirm={({ date: d }) => {
            setDate(formatDate(d))
            setOpenDatePicker(false)
          }}
        />
      </Modal>
    </Portal>
  )
})

const styles = StyleSheet.create({
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
  },
  dropdownWrapper: {
    position: "relative",
    marginBottom: 15,
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderRadius: 4,
    zIndex: 1000,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    maxHeight: 150,
  },
  loading: {
    padding: 12,
  },
  addButton: {
    marginTop: 10,
  },
})