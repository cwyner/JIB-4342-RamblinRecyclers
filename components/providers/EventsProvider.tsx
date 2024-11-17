import {
    createContext,
    useContext,
    useState,
    PropsWithChildren,
} from "react";
import { CalendarProvider } from "react-native-calendars"
import { getTodaysDate } from "../../lib/dateUtils"
import { withTheme } from "react-native-paper"

interface Event {
    hour: string
    duration: string
    title: string;
    description?: string;
}

interface AgendaItem {
    title: string;
    data: Event[];
}

interface EventsContextType {
    agendaItems: AgendaItem[];
    addEvent: (date: string, event: Event) => void;
    removeEvent: (date: string, title: string) => void;
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

export function useEvents() {
    const context = useContext(EventsContext);
    if (!context) {
        throw new Error("useEvents must be used within an EventsProvider");
    }
    return context;
}

type EventsProviderProps = PropsWithChildren<{
    initialAgendaItems?: AgendaItem[];
}>;

function EventsProvider({ children, initialAgendaItems = [] }: EventsProviderProps) {
    const todaysDate = getTodaysDate();

    const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(initialAgendaItems);

    const addEvent = (date: string, event: Event) => {
        setAgendaItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex((item) => item.title === date);

            if (existingItemIndex >= 0) {
                const updatedItem = {
                    ...prevItems[existingItemIndex],
                    data: [...prevItems[existingItemIndex].data, event],
                };
                return [
                    ...prevItems.slice(0, existingItemIndex),
                    updatedItem,
                    ...prevItems.slice(existingItemIndex + 1),
                ];
            } else {
                return [...prevItems, { title: date, data: [event] }];
            }
        });
    };

    const removeEvent = (date: string, title: string) => {
        setAgendaItems((prevItems) => {
            const existingItemIndex = prevItems.findIndex((item) => item.title === date);

            if (existingItemIndex >= 0) {
                const updatedData = prevItems[existingItemIndex].data.filter((event) => event.title !== title);

                if (updatedData.length > 0) {
                    const updatedItem = { ...prevItems[existingItemIndex], data: updatedData };
                    return [
                        ...prevItems.slice(0, existingItemIndex),
                        updatedItem,
                        ...prevItems.slice(existingItemIndex + 1),
                    ];
                } else {
                    return [...prevItems.slice(0, existingItemIndex), ...prevItems.slice(existingItemIndex + 1)];
                }
            }
            return prevItems;
        });
    };

    return (
        <EventsContext.Provider value={{ agendaItems, addEvent, removeEvent }}>
            <CalendarProvider date={todaysDate} numberOfDays={7}>
                {children}
            </CalendarProvider>
        </EventsContext.Provider>
    );
}

export default withTheme(EventsProvider)