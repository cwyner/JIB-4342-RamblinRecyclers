import React, { useState } from "react"
import { Portal } from "react-native-paper"
import CalendarAgenda from "./CalendarAgenda"
import NewEventModal from "./NewEventModal"
import FloatingButton from "./FloatingButton"

function CalendarView() {
  const [isModalVisible, setIsModalVisible] = useState(false)

  const openModal = () => setIsModalVisible(true)
  const closeModal = () => setIsModalVisible(false)

  return (
    <>
      <CalendarAgenda />
      <Portal>
        <NewEventModal
          visible={isModalVisible}
          onClose={closeModal}
        />
      </Portal>
      <FloatingButton onPress={openModal} />
    </>
  );
}

export default CalendarView;
