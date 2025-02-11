import React from "react";
import { Agenda } from "react-native-calendars";
import { useEvents } from "@/components/providers/EventsProvider";
import AgendaItem from "@/components/ui/AgendaItem";

interface CalendarAgendaProps {
  onEventPress: (event: any) => void;
}

function CalendarAgenda({ onEventPress }: CalendarAgendaProps) {
  const { agendaItems, updateEvent } = useEvents();

  const toggleComplete = async (id: string, completed: boolean) => {
    await updateEvent(id, { completed });
  };

  const renderItem = (item: any) => (
    <AgendaItem item={item} onPress={() => onEventPress(item)} onToggleComplete={toggleComplete} />
  );

  return (
    <Agenda
      items={agendaItems.reduce(
        (acc, { title, data }) => ({
          ...acc,
          [title]: data,
        }),
        {}
      )}
      renderItem={renderItem}
    />
  );
}

export default CalendarAgenda;
