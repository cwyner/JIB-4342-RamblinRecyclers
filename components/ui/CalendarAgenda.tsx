import React, { useState, useEffect } from "react";
import { Agenda } from "react-native-calendars";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import { useEvents } from "@/components/providers/EventsProvider";
import AgendaItem from "@/components/ui/AgendaItem";
import NewEventModal from "@/components/ui/NewEventModal";
import { AntDesign } from "@expo/vector-icons";

interface CalendarAgendaProps {
  onEventPress: (event: any) => void;
}

function CalendarAgenda({ onEventPress }: CalendarAgendaProps) {
  const eventsContext = useEvents();

  if (!eventsContext) {
    console.error("Error: useEvents() returned undefined.");
    return null;
  }

  const { agendaItems, loading } = eventsContext;
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setSelectedDate(new Date().toISOString().split("T")[0]);
  }, [agendaItems]);

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    setSelectedDate(newDate.toISOString().split("T")[0]);
  };

  const renderItem = (item: any) => {
    if (!item || Object.keys(item).length === 0) {
      return null;
    }
    return <AgendaItem item={item} onPress={() => onEventPress(item)} />;
  };

  return (
    <View style={styles.container}>
      {/* Navigation Buttons at the Top */}
      <View style={styles.buttonContainer}>
        <Button title="Previous Week" onPress={() => navigateWeek("prev")} />
        <Button title="Next Week" onPress={() => navigateWeek("next")} />
      </View>

      <Agenda
        items={
          agendaItems
            ? agendaItems.reduce(
                (acc, { title, data }) => ({
                  ...acc,
                  [title]: data,
                }),
                {}
              )
            : {}
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
              <Text style={styles.emptyText}>No events scheduled for today.</Text>
            </View>
          )
        }
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <AntDesign name="plus" size={28} color="white" />
      </TouchableOpacity>

      {/* New Event Modal */}
      <NewEventModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
  },
  addButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#6200ee",
    width: 56,
    height: 56,
    borderRadius: 28,
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
});

export default CalendarAgenda;
