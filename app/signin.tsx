import { 
    Card,
    Button,
    withTheme,
    TextInput,
    Avatar,
} from "react-native-paper";
import { 
    View,
    StyleSheet
} from "react-native"
import { useSession } from "@/components/SessionProvider";
import { useState } from "react";
import { useRouter } from "expo-router";

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
            <Card.Actions>
                <Button mode="contained" onPress={handleSignIn}>Log In</Button>
            </Card.Actions>
        </Card>
    )
}

function SignUp() {
    return (
        <></>
    )
}

function Auth() {
    return (
        <View style={styles.container}>
            <LogIn />
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
});

export default withTheme(Auth)