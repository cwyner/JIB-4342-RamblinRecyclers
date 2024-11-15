import { View, Text } from "react-native"
import { withTheme } from "react-native-paper"

function HomeLayout({ theme }) {
    return (
        <View>
            <Text>Hello, World!</Text>
        </View>
    )
}

export default withTheme(HomeLayout)