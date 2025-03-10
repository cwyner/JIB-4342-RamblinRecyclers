import React, { useState, useEffect } from "react"
import { Agenda } from "react-native-calendars"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { useEvents } from "@/components/providers/EventsProvider"
import AgendaItem from "@/components/ui/AgendaItem"
import NewEventModal from "@/components/ui/NewEventModal"
import { AntDesign } from "@expo/vector-icons"

interface CalendarAgendaProps {
  onEventPress: (event: any) => void
}

function CalendarAgenda({ onEventPress }: CalendarAgendaProps) {
  const eventsContext = useEvents()

  if (!eventsContext) {
    console.error("Error: useEvents() returned undefined.")
    return null
  }

  const { agendaItems, loading } = eventsContext
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  )
  const [modalVisible, setModalVisible] = useState(false)
  const [showWeekly, setShowWeekly] = useState(false)

  const getWeekDates = (date: string) => {
    const current = new Date(date)
    const startOfWeek = new Date(current)
    const endOfWeek = new Date(current)

    startOfWeek.setDate(current.getDate() - current.getDay()) // Start from Sunday
    endOfWeek.setDate(startOfWeek.getDate() + 6) // End on Saturday

    const dates = []
    for (
      let d = new Date(startOfWeek);
      d <= endOfWeek;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(new Date(d).toISOString().split("T")[0])
    }
    return dates
  }

  const getAgendaItems = (dates: string[]) => {
    const agenda = {}

    dates.forEach((date) => {
      agenda[date] = []
    })

    agendaItems.forEach(({ title, data }) => {
      data.forEach((event: any) => {
        if (agenda[event.date]) {
          agenda[event.date].push(event)
        }
      })
    })

    return agenda
  }

  const weekDates = getWeekDates(selectedDate)
  const allAgendaItems = getAgendaItems(weekDates)

  const hasEventsOnDate = (date: string) =>
    allAgendaItems[date] && allAgendaItems[date].length > 0

  useEffect(() => {
    setShowWeekly(!hasEventsOnDate(selectedDate))
  }, [selectedDate, allAgendaItems])

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7))
    setSelectedDate(newDate.toISOString().split("T")[0])
  }

  const updateEventCompletion = async (eventId: string, completed: boolean) => {
    try {
      await eventsContext.updateEvent(eventId, { completed })
    } catch (error) {
      console.error("Error updating event completion:", error)
    }
  }

  const renderItem = (item: any) => {
    if (!item || Object.keys(item).length === 0) {
      return null
    }
    return (
      <AgendaItem
        item={item}
        onPress={() => onEventPress(item)}
        onToggleComplete={(id, completed) => {
          updateEventCompletion(id, completed)
        }}
      />
    )
  }

  return (
    <View style={styles.container}>
      {/* Date and Navigation Buttons Row */}
      <View style={styles.topRow}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateWeek("prev")}
        >
          <Text style={styles.navButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.dateBox}>
          <Text style={styles.dateText}>{selectedDate}</Text>
        </View>

        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateWeek("next")}
        >
          <Text style={styles.navButtonText}>→</Text>
        </TouchableOpacity>
      </View>

      <Agenda
        items={
          showWeekly
            ? allAgendaItems
            : { [selectedDate]: allAgendaItems[selectedDate] }
        }
        selected={selectedDate}
        renderItem={renderItem}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        renderEmptyData={() =>
          loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {showWeekly
                  ? "No events today, showing weekly overview."
                  : "No events scheduled for today."}
              </Text>
            </View>
          )
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <AntDesign name="plus" size={28} color="white" />
      </TouchableOpacity>

      {/* New Event Modal */}
      <NewEventModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f8", // Light background for better readability
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 8,
  },
  dateBox: {
    backgroundColor: "#6200ee",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  navButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#6200ee",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#999",
  },
})

export default CalendarAgenda
