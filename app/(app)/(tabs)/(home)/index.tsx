import React from "react"
import { View } from "react-native"
import { withTheme, Portal } from "react-native-paper"
import EventsProvider from "@/components/providers/EventsProvider"
import CalendarView from "@/components/ui/CalendarView"

function Home({ theme }: { theme: any }) {
  return (
    <View style={{ flex: 1 }}>
      <EventsProvider>
        <Portal.Host>
          <CalendarView />
        </Portal.Host>
      </EventsProvider>
    </View>
  )
}
export default withTheme(Home)
