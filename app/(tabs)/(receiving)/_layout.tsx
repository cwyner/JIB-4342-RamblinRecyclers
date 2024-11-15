import { View, Text } from "react-native"
import { withTheme } from "react-native-paper"

function ReceivingLayout({ theme }) {

    return (
        <View>
            <Text>Ramblin' Wrecks!</Text>
        </View>
    )
}

export default withTheme(ReceivingLayout)