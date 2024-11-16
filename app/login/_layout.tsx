import { View } from "react-native"
import { withTheme } from "react-native-paper"
import { Stack } from "expo-router"

function AuthLayout({ theme }: { theme: any }) {
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
                        title: "Log In",
                    }}
                /> 
            </Stack>
        </View>
    )
}

export default withTheme(AuthLayout)