import React, { useState } from "react"
import { View, ActivityIndicator, Text, StyleSheet } from "react-native"
import CalendarAgenda from "@/components/ui/CalendarAgenda"
import { useEvents } from "@/components/providers/EventsProvider"
import ViewEventModal from "@/components/ui/ViewEventModal"

function CalendarView() {
  const { agendaItems, loading } = useEvents()
  const [selectedEvent, setSelectedEvent] = useState(null)

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    )
  }

  if (!loading && agendaItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No events scheduled for today.</Text>
      </View>
    )
  }

  return (
    <>
      <CalendarAgenda
        onEventPress={(event) => {
          setSelectedEvent(event)
        }}
      />
      {selectedEvent && (
        <ViewEventModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
})

export default CalendarView
