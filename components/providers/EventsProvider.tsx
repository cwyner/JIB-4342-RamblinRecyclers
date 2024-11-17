import {
    createContext,
    useContext,
    useState,
    useEffect,
    PropsWithChildren,
} from "react"
import {
    CalendarProvider,
    CalendarContextProviderProps,
} from "react-native-calendars"
import { MarkedDates } from "react-native-calendars/src/types"
import {
    getTodaysDate,
    Event,
    getUserEvents,
} from "../../lib/dateUtils"
import { withTheme } from "react-native-paper"

interface EventsContextType {
    events: Event[]
    addEvent: (event: Event) => void
    removeEvent: (title: string) => void
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function useEvents() {
    const context = useContext(EventsContext)
    if (!context) {
        throw new Error("useEvents must be used within an EventsProvider")
    }
    return context
}

type EventsProviderProps = PropsWithChildren<{
    initialEvents?: Event[]
}>

function EventsProvider({ children, initialEvents = [] }: EventsProviderProps) {
    const todaysDate = getTodaysDate()
    const [ events, setEvents ] = useState<Event[]>(initialEvents)

    const addEvent = (event: Event) => {
        setEvents((prevEvents) => [...prevEvents, event])
    }

    const removeEvent = (title: string) => {
        setEvents((prevEvents) => prevEvents.filter((event) => event.title !== title))
    }

    return (
        <EventsContext.Provider value={{ events, addEvent, removeEvent }}>
            <CalendarProvider
                date={todaysDate}
                numberOfDays={7}
            >
                { children }
            </CalendarProvider>
        </EventsContext.Provider>
    )
}

export default withTheme(EventsProvider)