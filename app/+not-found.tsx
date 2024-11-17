import { Link } from "expo-router"
import { View } from "react-native"
import { withTheme } from "react-native-paper"

function NotFoundScreen({ theme }: { theme: any }) {
    console.log("404 - Not Found")
    return (
        <>
            <View>
                <Link href="/home">Go to home screen</Link>
            </View>
        </>
    )
}

export default withTheme(NotFoundScreen)