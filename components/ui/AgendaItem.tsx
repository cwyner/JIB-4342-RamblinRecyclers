import {
    withTheme,
    Text,
} from "react-native-paper"

function AgendaItem({ theme, item }: { theme: any, item: any }) {
    return (
        <View style={[styles.item, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.itemText}>{item.name}</Text>
        </View>
    )
}

export default withTheme(AgendaItem)