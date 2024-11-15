import { Stack } from "expo-router"
import {
    MD3LightTheme as DefaultTheme,
    MD3DarkTheme,
    PaperProvider,
    adaptNavigationTheme,
} from "react-native-paper"
import {
    DefaultTheme as DefaultNavigationTheme,
    DarkTheme as DarkNavigationTheme,
} from "@react-navigation/native"

const { LightTheme, DarkTheme: NavigationDarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultNavigationTheme,
    reactNavigationDark: DarkNavigationTheme,
});

const CombinedDefaultTheme = {
    ...DefaultTheme,
    ...LightTheme,
}

const CombinedDarkTheme = {
    ...MD3DarkTheme,
    ...NavigationDarkTheme,
}

export default function RootLayout() {
    const isDark = false

    return (
        <PaperProvider theme={ isDark ? CombinedDarkTheme : CombinedDefaultTheme }>
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </PaperProvider>
        
    )
}