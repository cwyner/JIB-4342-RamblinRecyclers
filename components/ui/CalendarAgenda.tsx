import React from "react";
import { withTheme } from "react-native-paper";
import { Agenda } from "react-native-calendars";
import AgendaItem from "./AgendaItem";
import { useEvents } from "../providers/EventsProvider";

function CalendarAgenda({ theme }: { theme: any }) {
    const { agendaItems } = useEvents();

    const renderItem = (item: any) => <AgendaItem item={item} />;

    const agendaTheme = {
        agendaDayTextColor: theme.colors.primary,
        agendaDayNumColor: theme.colors.primary,
        agendaTodayColor: theme.colors.accent,
        agendaKnobColor: theme.colors.primary,
    };

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
            theme={agendaTheme}
        />
    );
}

export default withTheme(CalendarAgenda);