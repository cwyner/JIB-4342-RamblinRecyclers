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
import { initializeApp } from "firebase/app"
import Auth from "./(auth)";

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

const firebaseConfig = {
    apiKey: "AIzaSyAcdXQxINC2P-yPRg2-tyYvRhe1bmL9LSQ",
    authDomain: "ramblinrecyclersdemo.firebaseapp.com",
    projectId: "ramblinrecyclersdemo",
    storageBucket: "ramblinrecyclersdemo.firebasestorage.app",
    messagingSenderId: "45339909847",
    appId: "1:45339909847:ios:73c25fc0576ad3acb0da92",
}

initializeApp(firebaseConfig)

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
        return <Text>Loading animation to be implemented...</Text>
    }
  
    return user ? <UserStack /> : <AuthStack />
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