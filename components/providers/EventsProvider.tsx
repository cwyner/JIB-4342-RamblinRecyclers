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
  doc,
  updateDoc,
  query,
  where,
  arrayUnion,
} from "firebase/firestore"
import { useSession } from "@/components/providers/SessionProvider"
import { withTheme } from "react-native-paper"

interface Event {
  hour: string
  duration: string
  title: string
  description?: string
  date: string
  teamName?: string // <-- Team name instead of teamId
}

interface AgendaItem {
  title: string
  data: Event[]
}

interface EventsContextType {
  agendaItems: AgendaItem[]
  addEvent: (date: string, event: Event) => Promise<void>
  removeEvent: (date: string, title: string) => Promise<void>
  loading: boolean
}

const EventsContext = createContext<EventsContextType | undefined>(undefined)

export function useEvents() {
  const context = useContext(EventsContext)
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider")
  }
  return context
}

function EventsProvider({ children }: PropsWithChildren<{}>) {
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useSession()
  const db = getFirestore()

  useEffect(() => {
    if (!user) return

    const fetchEvents = async () => {
      setLoading(true)
      try {
        const eventsQuery = query(
          collection(db, "events"),
          where("userId", "==", user.uid)
        )
        const snapshot = await getDocs(eventsQuery)

        if (snapshot.empty) {
          setAgendaItems([])
          setLoading(false)
          return
        }

        const events = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Event & { date?: string }
          return {
            ...data,
            date: data.date ?? docSnap.id,
          }
        })

        const formattedEvents = events.reduce<AgendaItem[]>((acc, event) => {
          const existingDate = acc.find((item) => item.title === event.date)

          if (existingDate) {
            existingDate.data.push(event)
          } else {
            acc.push({ title: event.date, data: [event] })
          }

          return acc
        }, [])

        setAgendaItems(formattedEvents)
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [user, db])

  /**
   * addEvent
   *
   * - Saves the event to the 'events' collection.
   * - If `teamName` is set, looks up the team document by that name,
   *   and updates its `eventIds` array with the new event's document ID.
   */
  const addEvent = async (date: string, event: Event) => {
    setLoading(true)
    try {
      // 1) Construct the new event object
      const newEvent = { ...event, date, userId: user?.uid }

      // 2) Add the event to Firestore (in /events)
      const eventRef = await addDoc(collection(db, "events"), newEvent)

      // 3) If the event has a teamName, find that team doc and update the eventIds array
      if (event.teamName && event.teamName.trim().length > 0) {
        const teamsRef = collection(db, "teams")
        const teamQuery = query(
          teamsRef,
          where("name", "==", event.teamName.trim())
        )
        const teamSnapshot = await getDocs(teamQuery)

        const teamDoc = teamSnapshot.docs[0]
        await updateDoc(doc(db, "teams", teamDoc.id), {
          eventIds: arrayUnion(eventRef.id),
        })
      }

      // 4) Update the local agenda state
      setAgendaItems((prevItems) => {
        const existingDate = prevItems.find((item) => item.title === date)
        if (existingDate) {
          existingDate.data.push(newEvent)
          return [...prevItems]
        } else {
          return [...prevItems, { title: date, data: [newEvent] }]
        }
      })
    } catch (error) {
      console.error("Error adding event to Firestore:", error)
    } finally {
      setLoading(false)
    }
  }

  const removeEvent = async (date: string, title: string) => {
    console.log("Remove Event - Date:", date)
    console.log("Remove Event - Title:", title)

    if (!user) return
    if (!date || !title) {
      console.error("Error: Date or Title is undefined in removeEvent.")
      return
    }

    try {
      const eventsQuery = query(
        collection(db, "events"),
        where("userId", "==", user.uid),
        where("date", "==", date),
        where("title", "==", title)
      )
      const snapshot = await getDocs(eventsQuery)

      // Delete all matching events
      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(docSnap.ref)
      )
      await Promise.all(deletePromises)

      // Update local state
      setAgendaItems((prevItems) =>
        prevItems
          .map((item) =>
            item.title === date
              ? {
                  ...item,
                  data: item.data.filter((ev) => ev.title !== title),
                }
              : item
          )
          .filter((item) => item.data.length > 0)
      )
    } catch (error) {
      console.error("Error deleting event:", error)
    }
  }

  return (
    <EventsContext.Provider
      value={{ agendaItems, addEvent, removeEvent, loading }}
    >
      {children}
    </EventsContext.Provider>
  )
}

export default withTheme(EventsProvider)
