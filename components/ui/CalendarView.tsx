import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Portal, FAB, Button } from "react-native-paper";
import CalendarAgenda from "@/components/ui/CalendarAgenda";
import NewEventModal from "@/components/ui/NewEventModal";
import ViewEventModal from "@/components/ui/ViewEventModal";
import { useEvents } from "@/components/providers/EventsProvider";
import moment from "moment";

function CalendarView() {
  const [isNewModalVisible, setIsNewModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(moment());
  const { loading } = useEvents();

  const openNewEventModal = () => setIsNewModalVisible(true);
  const closeNewEventModal = () => setIsNewModalVisible(false);
  const openViewEventModal = (event) => setSelectedEvent(event);
  const closeViewEventModal = () => setSelectedEvent(null);

  const goToPreviousWeek = () => {
    setCurrentWeek((prevWeek) => moment(prevWeek).subtract(1, "week"));
  };

  const goToNextWeek = () => {
    setCurrentWeek((prevWeek) => moment(prevWeek).add(1, "week"));
  };

  if (loading) {
    return (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <>
      <View style={styles.navigationContainer}>
        <Button onPress={goToPreviousWeek} mode="contained" style={styles.smallNavigationButton}>
          Previous
        </Button>
        <Button onPress={goToNextWeek} mode="contained" style={styles.smallNavigationButton}>
          Next
        </Button>
      </View>
      <CalendarAgenda onEventPress={openViewEventModal} weekStartDate={currentWeek.startOf("week").toDate()} />
      <Portal>
        <NewEventModal visible={isNewModalVisible} onClose={closeNewEventModal} />
        {selectedEvent && <ViewEventModal event={selectedEvent} onClose={closeViewEventModal} />}
      </Portal>
      <FAB style={styles.fab} icon="plus" onPress={openNewEventModal} />
    </>
  );
}

const styles = StyleSheet.create({
  spinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  smallNavigationButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 4,
    fontSize: 12,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#6200ee",
  },
});

export default CalendarView;