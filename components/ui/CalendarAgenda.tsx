import { useState } from "react"
import { withTheme, Text } from "react-native-paper";
import { Agenda } from "react-native-calendars";

function CalendarAgenda({ theme }: { theme: any }) {
    const [items, setItems] = useState({})

    const loadItems = (day) => {
        setTimeout(() => {
        const newItems = {}
        const time = day.timestamp
        newItems[time] = [{ name: 'Event for this day', height: 50 }]
        setItems(newItems)
        }, 1000)
    }

    const renderItem = (item) => {
        return (
        <View style={[styles.item, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.itemText}>{item.name}</Text>
        </View>
        )
    }

    return (
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
    )
}

export default withTheme(CalendarAgenda)