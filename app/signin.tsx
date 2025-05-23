import {
  Card,
  Button,
  withTheme,
  Text,
  TextInput,
  Avatar,
  Checkbox,
} from "react-native-paper"
import { Link } from "expo-router"
import { View, StyleSheet, TouchableOpacity } from "react-native"
import { useSession } from "@/components/providers/SessionProvider"
import { useState } from "react"
import { useRouter } from "expo-router"
import * as SecureStore from "expo-secure-store"
import { MaterialIcons } from "@expo/vector-icons"

function LogIn() {
  const { signIn } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const router = useRouter()

  const handleSignIn = async () => {
    try {
      setLocalError(null)
      if (rememberMe) {
        await SecureStore.setItemAsync("email", email)
        await SecureStore.setItemAsync("password", password)
      }
      await signIn(email, password)
      router.push("/")
    } catch (err) {
      setLocalError("Invalid email or password.")
    }
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
        <Text style={styles.text}>
          Don't have an account?{" "}
          <Link style={styles.link} href="/register">
            Register
          </Link>
        </Text>
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={styles.rememberMeContainer}
          >
            <MaterialIcons
              name={rememberMe ? "check-box" : "check-box-outline-blank"}
              size={24}
              color="#6200ee"
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
          </TouchableOpacity>
        </View>
        {localError && <Text style={styles.errorText}>{localError}</Text>}
        <Card.Actions>
          <Button mode="contained" onPress={handleSignIn}>
            Log In
          </Button>
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
    backgroundColor: "white",
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
    marginLeft: 16,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    marginLeft: 7,
  },
  rememberMeText: {
    marginLeft: 4,
    fontSize: 14,
  },
  errorText: {
    color: "red",
    marginLeft: 16,
    marginTop: 8,
  },
})

export default withTheme(LogIn)
