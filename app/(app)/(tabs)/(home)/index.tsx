import React from "react";
import {
  View,
  StyleSheet
} from "react-native";
import { withTheme } from "react-native-paper";
import EventsProvider from "@/components/providers/EventsProvider";
import CalendarAgenda from "@/components/ui/CalendarAgenda";

const mockAgendaItems = [
    {
        title: "2024-11-16",
        data: [
            {
                hour: "9am",
                duration: "1h",
                title: "Morning Yoga",
                description: "Start your day with a refreshing yoga session.",
            },
            {
                hour: "11am",
                duration: "2h",
                title: "Team Meeting",
                description: "Discuss project milestones and upcoming tasks.",
            },
        ],
    },
    {
        title: "2024-11-17",
        data: [
            {
                hour: "2pm",
                duration: "1h",
                title: "Lunch with Alex",
                description: "Catch up over lunch at the new cafe.",
            },
            {
                hour: "4pm",
                duration: "1h",
                title: "Grocery Shopping",
                description: "Get groceries for the week.",
            },
        ],
    },
    {
        title: "2024-11-18",
        data: [
            {
                hour: "7pm",
                duration: "2h",
                title: "Gym Workout",
                description: "Focus on strength training and cardio.",
            },
        ],
    },
];

function Home({ theme }: { theme: any }) {
    return (
        <View style={{ flex: 1 }}>
            <EventsProvider initialAgendaItems={mockAgendaItems}>
                <CalendarAgenda />
            </EventsProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    itemText: {
        fontSize: 14,
        color: "white",
    },
});

export default withTheme(Home);
