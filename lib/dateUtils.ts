export interface Event {
    title: string
    hour: string
    duration: string
    description: string
}

export function getTodaysDate() {
    const now = new Date()

    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, '0')
    const day = String(now.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

export function getUserEvents(id: string): Event | undefined {
    // TODO: Get user's event data from Firebase
    return undefined
}