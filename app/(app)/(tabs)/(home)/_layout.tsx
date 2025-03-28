import { View } from "react-native"
import { Appbar, withTheme } from "react-native-paper"
import { Stack } from "expo-router/stack"
import { HamburgerMenu } from "@/components/ui/HamburgerMenu"
import { ScreenHeader } from "@/components/ui/ScreenHeader"

function HomeLayout({ theme }: { theme: any }) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            header: () => <ScreenHeader title="Home" />,
          }}
        />
        <Stack.Screen
          name="teams"
          options={{
            header: () => <ScreenHeader title="Teams" />,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            header: () => <ScreenHeader title="Settings" />,
          }}
        />
      </Stack>
    </View>
  )
}

export default withTheme(HomeLayout)
