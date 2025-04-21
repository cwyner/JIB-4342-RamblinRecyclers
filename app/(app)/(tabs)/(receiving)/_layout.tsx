import { View } from "react-native"
import { withTheme } from "react-native-paper"
import { Stack } from "expo-router/stack"
import { ScreenHeader } from "@/components/ui/ScreenHeader"

function ReceivingLayout({ theme }: { theme: any }) {

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
            header: () => <ScreenHeader title="Edit Item" />,
          }}
        />
      </Stack>
    </View>
  )
}

export default withTheme(ReceivingLayout)
