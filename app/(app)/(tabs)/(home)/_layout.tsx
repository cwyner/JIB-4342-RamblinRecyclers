import { View } from "react-native"
import { withTheme } from "react-native-paper"
import { Stack } from "expo-router/stack"
import { Portal } from "react-native-paper"

function HomeLayout({ theme }: { theme: any }) {
    return (
        <Portal.Host>
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
                            title: "Home",
                        }}
                    /> 
                </Stack>
            </View>
        </Portal.Host>
    )
}

export default withTheme(HomeLayout)