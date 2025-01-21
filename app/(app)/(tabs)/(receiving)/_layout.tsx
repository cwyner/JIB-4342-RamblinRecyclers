import { View } from "react-native"
import { withTheme } from "react-native-paper"
import { Stack } from "expo-router/stack"
import { useSession } from "@/components/providers/SessionProvider"
import { Button } from "react-native-paper";

function ReceivingLayout({ theme }: { theme: any }) {
    const { signOut } = useSession()

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.colors.background,
            }}
        >
            <Stack>
                <Stack.Screen
                    name="index"
                    options={{
                        title: "Receiving",
                        headerRight: () => (
                            <Button onPress={async () => await signOut()}>Log Out</Button>
                        )
                    }}
                /> 
            </Stack>
        </View>
    )
}

export default withTheme(ReceivingLayout)