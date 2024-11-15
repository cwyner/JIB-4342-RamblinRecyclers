import { View, Text } from "react-native"
import { withTheme } from "react-native-paper"

function MaterialsLayout({ theme }) {

    return (
        <View>
            <Text>Hello, Atlanta!</Text>
        </View>
    )
}

export default withTheme(MaterialsLayout)