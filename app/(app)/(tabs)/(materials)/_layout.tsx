import { View } from "react-native"
import { withTheme } from "react-native-paper"
import { Stack } from "expo-router/stack"
import { useSession } from "@/components/providers/SessionProvider"
import { Button } from "react-native-paper"
import { ScreenHeader } from "@/components/ui/ScreenHeader"

function MaterialsLayout({ theme }: { theme: any }) {
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
            header: () => <ScreenHeader title="Materials" />,
          }}
        />
        <Stack.Screen
          name="items/index"
          options={{
            header: () => <ScreenHeader title="Edit Item" />,
          }}
        />
      </Stack>
    </View>
  )
}

export default withTheme(MaterialsLayout)
