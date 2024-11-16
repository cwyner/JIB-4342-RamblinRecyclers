import { Stack } from "expo-router"
import { Text } from "react-native"
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
import {
    SessionProvider,
    useSession
} from "@/components/SessionProvider";

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

function UserStack() {
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

function AuthStack() {
    return (
        <Stack>
            <Stack.Screen
                name="(auth)"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    )
}

function AppContent() {
    const { user, isLoading } = useSession();
  
    if (isLoading) {
      return <Text>Loading animation to be implemented...</Text>;
    }
  
    return user ? <UserStack /> : <AuthStack />;
  }

export default function RootLayout() {
    const isDark = false

    return (
        <PaperProvider theme={ isDark ? CombinedDarkTheme : CombinedDefaultTheme }>
            <SessionProvider>
                <AppContent />
            </SessionProvider>
        </PaperProvider>
        
    )
}