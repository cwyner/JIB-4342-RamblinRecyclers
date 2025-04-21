import React, { useEffect, useState, useMemo } from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import {
  Card,
  TextInput,
  Button,
  List,
  IconButton,
  Subheading,
  withTheme,
  Portal,
  Dialog,
  RadioButton,
} from "react-native-paper"
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  getFirestore,
  getDocs,
  collection,
  query,
  where,
} from "firebase/firestore"
import { useSession } from "@/components/providers/SessionProvider"
import debounce from "lodash.debounce"

type OrgMembership = {
  orgId: string
  orgName: string
  role: "manager" | "member" | "admin"
}

function SettingsScreen({ theme }: { theme: any }) {
  const { user, isLoading } = useSession()
  const db = getFirestore()

  const [username, setUsername] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [organizations, setOrganizations] = useState<OrgMembership[]>([])

  const [showAddOrgDialog, setShowAddOrgDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedOrg, setSelectedOrg] = useState<any | null>(null)
  const [selectedRole, setSelectedRole] = useState<"manager" | "member" | "admin">("member")

  useEffect(() => {
    if (user) fetchUserData()
  }, [user])

  const fetchUserData = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid)
      const docSnap = await getDoc(userDocRef)

      if (docSnap.exists()) {
        const data = docSnap.data()
        setUsername(data.email ?? "")
        setFirstName(data.firstName ?? "")
        setLastName(data.lastName ?? "")
        setOrganizations(data.organizations ?? [])
      } else {
        await setDoc(userDocRef, { username: "", firstName: "", lastName: "", organizations: [] })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    }
  }

  const handleSave = async () => {
    if (!user) return
    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, { username, firstName, lastName, organizations })
      console.log("User settings updated successfully.")
    } catch (error) {
      console.error("Error saving user settings:", error)
    }
  }

  const handleShowAddOrgDialog = () => {
    setSearchQuery("")
    setSearchResults([])
    setSelectedOrg(null)
    setSelectedRole("member")
    setShowAddOrgDialog(true)
  }

  const debouncedSearchOrgs = useMemo(
    () =>
      debounce(async (queryText: string) => {
        if (!queryText) {
          setSearchResults([])
          return
        }
        try {
          const orgRef = collection(db, "organizations")
          const qOrg = query(
            orgRef,
            where("name", ">=", queryText),
            where("name", "<=", queryText + "\uf8ff")
          )
          const snapshot = await getDocs(qOrg)
          const results: any[] = []
          snapshot.forEach(docSnap => results.push({ id: docSnap.id, ...docSnap.data() }))
          setSearchResults(results)
        } catch (error) {
          console.error("Error searching organizations:", error)
        }
      }, 500),
    [db]
  )

  useEffect(() => {
    return () => {
      debouncedSearchOrgs.cancel()
    }
  }, [debouncedSearchOrgs])

  const onChangeSearch = (text: string) => {
    debouncedSearchOrgs(text)
  }

  const handleSelectOrg = (org: any) => {
    setSelectedOrg(org)
    setSearchResults([])
  }

  const handleAddOrganization = async () => {
    if (!user || !selectedOrg) return
    const newMembership: OrgMembership = {
      orgId: selectedOrg.id,
      orgName: selectedOrg.name,
      role: selectedRole,
    }
    const updated = [...organizations, newMembership]
    setOrganizations(updated)
    try {
      const userDocRef = doc(db, "users", user.uid)
      await updateDoc(userDocRef, { organizations: updated })
    } catch (error) {
      console.error("Error adding organization to user:", error)
    }
    setShowAddOrgDialog(false)
  }

  const handleRemoveOrganization = (index: number) => {
    const updated = organizations.filter((_, i) => i !== index)
    setOrganizations(updated)
    if (user) {
      const userDocRef = doc(db, "users", user.uid)
      updateDoc(userDocRef, { organizations: updated }).catch(err =>
        console.error("Error removing organization:", err)
      )
    }
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
        <Subheading>Loading user data...</Subheading>
      </View>
    )
  }
  if (!user) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 16 }}>
        <Subheading>Please sign in to view your settings.</Subheading>
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={styles.card}>
        <Card.Title title="Account Settings" />
        <Card.Content>
          <TextInput label="Username" value={username} onChangeText={setUsername} style={{ marginBottom: 16 }} />
          <TextInput label="First Name" value={firstName} onChangeText={setFirstName} style={{ marginBottom: 16 }} />
          <TextInput label="Last Name" value={lastName} onChangeText={setLastName} style={{ marginBottom: 16 }} />

          <Subheading style={{ marginTop: 16, marginBottom: 8 }}>Organizations</Subheading>
          {organizations.map((m, i) => (
            <List.Item
              key={i}
              title={`${m.orgName} (${m.role})`}
              right={() => <IconButton icon="delete" onPress={() => handleRemoveOrganization(i)} />}
            />
          ))}

          <Button icon="plus" mode="outlined" style={{ marginTop: 8 }} onPress={handleShowAddOrgDialog}>
            Add Organization
          </Button>
        </Card.Content>

        <Card.Actions>
          <Button mode="contained" onPress={handleSave}>
            Save
          </Button>
        </Card.Actions>
      </Card>

      <Portal>
        <Dialog visible={showAddOrgDialog} onDismiss={() => setShowAddOrgDialog(false)}>
          <Dialog.Title>Add Organization</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Search Organizations"
              onChangeText={onChangeSearch}
              style={{ marginBottom: 8 }}
            />
            {searchResults.map(org => (
              <List.Item key={org.id} title={org.name} onPress={() => handleSelectOrg(org)} />
            ))}

            {selectedOrg && (
              <>
                <Subheading style={{ marginTop: 16 }}>Selected: {selectedOrg.name}</Subheading>
                <Subheading style={{ marginTop: 8 }}>Choose a Role:</Subheading>
                <RadioButton.Group onValueChange={val => setSelectedRole(val as any)} value={selectedRole}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RadioButton value="manager" />
                    <Subheading>Manager</Subheading>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RadioButton value="member" />
                    <Subheading>Member</Subheading>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RadioButton value="admin" />
                    <Subheading>Admin</Subheading>
                  </View>
                </RadioButton.Group>
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddOrgDialog(false)}>Cancel</Button>
            <Button onPress={handleAddOrganization} disabled={!selectedOrg}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
})

export default withTheme(SettingsScreen)