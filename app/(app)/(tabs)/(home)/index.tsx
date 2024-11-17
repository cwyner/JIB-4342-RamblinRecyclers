import React, { useState } from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import { withTheme } from 'react-native-paper'
import EventsProvider from '@/components/providers/EventsProvider'
import CalendarAgenda from '@/components/ui/CalendarAgenda'

function Home({ theme }: { theme: any }) {
  return (
    <View style={{ flex: 1 }}>
      <EventsProvider>
        <CalendarAgenda />
      </EventsProvider>
    </View>
  )
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
    color: 'white',
  },
})

export default withTheme(Home)
