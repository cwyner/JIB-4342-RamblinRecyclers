import React, { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { withTheme } from 'react-native-paper'
import { Agenda } from 'react-native-calendars'

function Home({ theme }) {
  const [items, setItems] = useState({})

  // Function to load items for a specific day
  const loadItems = (day) => {
    setTimeout(() => {
      // Add some events to the day (this is just an example)
      const newItems = {}
      const time = day.timestamp
      newItems[time] = [{ name: 'Event for this day', height: 50 }]
      setItems(newItems)
    }, 1000)
  }

  // Render items for each day
  const renderItem = (item) => {
    return (
      <View style={[styles.item, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <Agenda
        items={items}
        loadItemsForMonth={loadItems}
        selected={'2024-11-15'}
        renderItem={renderItem}
        minDate={'2024-01-01'}
        maxDate={'2024-12-31'}
        onDayPress={(day) => {
          console.log('Selected day:', day)
        }}
        monthFormat={'yyyy MM'}
        // Additional Agenda Props
        renderDay={(day, item) => (
          <View>
            <Text>{day ? day.day : ''}</Text>
          </View>
        )}
        renderEmptyData={() => <Text>No events for this day</Text>}
        theme={{
          selectedDayBackgroundColor: theme.colors.accent,
          todayTextColor: theme.colors.primary,
        }}
      />
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
