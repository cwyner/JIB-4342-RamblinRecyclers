import React, { 
    createContext,
    useContext,
    useEffect,
    useState,
    PropsWithChildren,
} from "react"
import {
    getFirestore,
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    query,
    where,
} from "firebase/firestore"
import { useSession } from "@/components/providers/SessionProvider"
import { withTheme } from "react-native-paper"

interface Event {
  hour: string
  duration: string
  title: string
  description?: string
}

interface AgendaItem {
  title: string
  data: Event[]
}

interface EventsContextType {
  agendaItems: AgendaItem[]
  addEvent: (date: string, event: Event) => Promise<void>
  removeEvent: (date: string, title: string) => Promise<void>
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider")
  }
  return context
}

type EventsProviderProps = PropsWithChildren<{}>;

function EventsProvider ({ children }: EventsProviderProps) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([])
  const { user } = useSession()
  const db = getFirestore()

  useEffect(() => {
    if (!user) return;
  
    const fetchEvents = async () => {
      try {
        console.log("Fetching events for user:", user.uid)
        const eventsQuery = query(collection(db, "events"), where("userId", "==", user.uid))
        const snapshot = await getDocs(eventsQuery)
        console.log("Fetched events snapshot:", snapshot)
  
        if (snapshot.empty) {
          console.log("No events found.")
          setAgendaItems([])
          return;
        }
  
        const events = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as (Event & { date: string })[]
        console.log("Formatted events:", events)
  
        // Format and set agenda items
        const formattedEvents = events.reduce<AgendaItem[]>((acc, event) => {
          const { date, ...rest } = event;
          const existingDate = acc.find((item) => item.title === date)
  
          if (existingDate) {
            existingDate.data.push(rest);
          } else {
            acc.push({ title: date, data: [rest] })
          }
  
          return acc;
        }, []);
  
        setAgendaItems(formattedEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    };
  
    fetchEvents();
  }, [user, db]);

  const addEvent = async (date: string, event: Event) => {
    if (!user) {
      console.error("No user is authenticated.")
      return;
    }
  
    try {
      const newEvent = { ...event, date, userId: user.uid }
      console.log("Adding event to Firestore:", newEvent)
  
      await addDoc(collection(db, "events"), newEvent)
  
      console.log("Event successfully added to Firestore.")
  
      // Update local state
      setAgendaItems((prevItems) => {
        const existingDate = prevItems.find((item) => item.title === date)
  
        if (existingDate) {
          existingDate.data.push(event)
          return [...prevItems];
        } else {
          return [...prevItems, { title: date, data: [event] }]
        }
      });
    } catch (error) {
      console.error("Error adding event to Firestore:", error)
    }
  }

  const removeEvent = async (date: string, title: string) => {
    if (!user) return;

    const eventsQuery = query(
      collection(db, "events"),
      where("userId", "==", user.uid),
      where("date", "==", date),
      where("title", "==", title)
    );
    const snapshot = await getDocs(eventsQuery)

    const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref))
    await Promise.all(deletePromises);

    setAgendaItems((prevItems) =>
      prevItems
        .map((item) =>
          item.title === date
            ? { ...item, data: item.data.filter((event) => event.title !== title) }
            : item
        )
        .filter((item) => item.data.length > 0)
    )
  }

  return (
    <EventsContext.Provider value={{ agendaItems, addEvent, removeEvent }}>
      {children}
    </EventsContext.Provider>
  )
}

export default withTheme(EventsProvider)