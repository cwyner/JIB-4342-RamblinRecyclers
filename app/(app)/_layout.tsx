import { Stack } from "expo-router/stack"
import { useSession } from "@/components/SessionProvider"
import { Text } from "react-native"
import { Redirect } from "expo-router"

export default function AppLayout() {
    const { user, isLoading } = useSession();
    
    if (isLoading) {
        return <Text>Loading animation to be implemented...</Text>
    }

    if (!user) {
        return <Redirect href="/signin" />
    }

    return (
        <Stack>
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    )
}