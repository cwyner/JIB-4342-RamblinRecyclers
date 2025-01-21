import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  PropsWithChildren 
} from 'react'
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import * as SecureStore from "expo-secure-store"

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  register: (email: string, password: string) => Promise<any>
  user: User | null
  isLoading: boolean
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useSession = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const auth = getAuth()

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const email = await SecureStore.getItemAsync("email");
        const password = await SecureStore.getItemAsync("password");

        if (email && password) {
          await signInWithEmailAndPassword(auth, email, password);
        }
      } catch (error) {
        console.error("Failed to load credentials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCredentials();

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      console.log("Log In Detected: ", authUser)
      setUser(authUser)
      setIsLoading(false)
    })
    return unsubscribe;
  }, [])

  const signIn = async (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signOut = async () => {
    //await SecureStore.deleteItemAsync("email");
    //await SecureStore.deleteItemAsync("password");
    return firebaseSignOut(auth)
  }

  const register = async (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut, register }}>
      {children}
    </AuthContext.Provider>
  )
}