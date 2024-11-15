import { Link, Stack } from "expo-router"
import { View } from "react-native"
import { withTheme } from "react-native-paper"

function NotFoundScreen({ theme }) {
    return (
        <>
            <Stack.Screen options={{ title: "Oops! This screen doesn't exist! :(" }} />
            <View style={ styles.container } >
                <Link href="/">Go to home screen</Link>
            </View>
        </>
    )
}

export default withTheme(NotFoundScreen)