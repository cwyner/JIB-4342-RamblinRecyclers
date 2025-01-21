import { 
    Card,
    Button,
    withTheme,
    TextInput,
    Text,
    Avatar,
} from "react-native-paper"
import { 
    View,
    StyleSheet
} from "react-native"
import { useSession } from "@/components/providers/SessionProvider"
import { useState } from "react"
import { useRouter, Link } from "expo-router"

function Register() {
    const { register } = useSession()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()

    const handleRegistration = async () => {
        await register(email, password)
        router.push("/")
    }

    return (
        <View style={styles.container}>
            <Card style={styles.card}>
                <Card.Title 
                    title="Upcycle Build App"
                    subtitle="New Account"
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
                        label="First Name"
                        style={styles.input}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="ascii-capable"
                    />
                    <TextInput
                        label="Last Name"
                        style={styles.input}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="ascii-capable"
                    />
                    <TextInput
                        label="Password"
                        secureTextEntry
                        style={styles.input}
                        onChangeText={setPassword}
                    />
                </Card.Content>
                <Text style={styles.text}>Already have an account? <Link style={styles.link} href="/signin">Log In.</Link></Text>
                <Card.Actions>
                    <Button mode="contained" onPress={handleRegistration}>Register</Button>
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
})

export default withTheme(Register)