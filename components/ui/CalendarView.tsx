import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import CalendarAgenda from "@/components/ui/CalendarAgenda";
import { useEvents } from "@/components/providers/EventsProvider";

function CalendarView() {
  const { agendaItems, loading } = useEvents();

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!loading && agendaItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No events scheduled for today.</Text>
      </View>
    );
  }

  return <CalendarAgenda onEventPress={(event) => console.log(event)} />;
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
});

export default CalendarView;
