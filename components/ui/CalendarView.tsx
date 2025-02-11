import React, { useState } from "react"
import { View, ActivityIndicator, StyleSheet } from "react-native"
import { Portal, FAB } from "react-native-paper"
import CalendarAgenda from "@/components/ui/CalendarAgenda"
import NewEventModal from "@/components/ui/NewEventModal"
import ViewEventModal from "@/components/ui/ViewEventModal"
import { useEvents } from "@/components/providers/EventsProvider"

function CalendarView() {
  const [isNewModalVisible, setIsNewModalVisible] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { loading } = useEvents()

  const openNewEventModal = () => setIsNewModalVisible(true)
  const closeNewEventModal = () => setIsNewModalVisible(false)
  const openViewEventModal = (event: any) => setSelectedEvent(event)
  const closeViewEventModal = () => setSelectedEvent(null)

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    )
  }

  return (
    <>
      <CalendarAgenda onEventPress={openViewEventModal} />
      <Portal>
        <NewEventModal
          visible={isNewModalVisible}
          onClose={closeNewEventModal}
        />
        {selectedEvent && (
          <ViewEventModal event={selectedEvent} onClose={closeViewEventModal} />
        )}
      </Portal>
      <FAB style={styles.fab} icon="plus" onPress={openNewEventModal} />
    </>
  )
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#6200ee",
  },
})

export default CalendarView
