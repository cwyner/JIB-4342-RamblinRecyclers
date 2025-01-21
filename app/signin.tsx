import { 
    Card,
    Button,
    withTheme,
    Text,
    TextInput,
    Avatar,
} from "react-native-paper"
import { Link } from "expo-router"
import { 
    View,
    StyleSheet
} from "react-native"
import { useSession } from "@/components/providers/SessionProvider"
import { useState } from "react"
import { useRouter } from "expo-router"

function LogIn() {
    const { signIn } = useSession()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleSignIn = async () => {
        await signIn(email, password)
        router.push("/")
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title 
                    title="Upcycle Build App"
                    subtitle="Log In"
                    left={(props) => <Avatar.Icon {...props} icon="account" />} 
                />
                <Card.Content>
                    <TextInput
                        label="Email"
                        style={styles.input}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                    />
                    <TextInput
                        label="Password"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={setPassword}
                    />
                </Card.Content>
                <Text style={styles.text}>Don't have an account? <Link style={styles.link} href="/register">Register</Link></Text>
                <Card.Actions>
                    <Button mode="contained" onPress={handleSignIn}>Log In</Button>
                </Card.Actions>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    card: {
        width: "90%",
        maxWidth: 400,
    },
    input: {
        marginBottom: 10,
    },
    link: {
        color: "blue",
    },
    text: {
        marginLeft: 16
    }
});

export default withTheme(LogIn)