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

const { LightTheme: NavigationLightTheme, DarkTheme: NavigationDarkTheme } = adaptNavigationTheme({
    reactNavigationLight: DefaultNavigationTheme,
    reactNavigationDark: DarkNavigationTheme,
  });
  
  const CombinedDefaultTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...NavigationLightTheme.colors,
    },
  };
  
  const CombinedDarkTheme = {
    ...MD3DarkTheme,
    colors: {
      ...MD3DarkTheme.colors,
      ...NavigationDarkTheme.colors,
    },
  };

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