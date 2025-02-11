import React from "react"
import { Agenda } from "react-native-calendars"
import { useEvents } from "@/components/providers/EventsProvider"
import AgendaItem from "@/components/ui/AgendaItem"

interface CalendarAgendaProps {
  onEventPress: (event: any) => void
}

function CalendarAgenda({ onEventPress }: CalendarAgendaProps) {
  const { agendaItems } = useEvents()

  const renderItem = (item: any) => {
    if (!item || Object.keys(item).length === 0) {
      return null
    }

    return <AgendaItem item={item} onPress={() => onEventPress(item)} />
  }

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
  )
}

export default CalendarAgenda
