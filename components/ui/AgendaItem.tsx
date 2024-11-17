import {
    withTheme,
    Text,
} from "react-native-paper"
import { 
    View,
    StyleSheet
} from "react-native"

function AgendaItem({ theme, item }: { theme: any, item: any }) {
    return (
        <View style={[styles.item, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.itemText}>{item.name}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    item: {
        flex: 1,
        padding: 10,
        marginRight: 10,
        marginTop: 17,
    },
    itemText: {
        fontSize: 14,
        color: "white",
    },
});

export default withTheme(AgendaItem)