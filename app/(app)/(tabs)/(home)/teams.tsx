import React, { useEffect, useState } from "react"
import { ScrollView, View, StyleSheet, Alert } from "react-native"
import {
  withTheme,
  Card,
  Text,
  Subheading,
  List,
  Button,
  IconButton,
  Portal,
  Dialog,
  TextInput,
  RadioButton,
} from "react-native-paper"
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  arrayUnion, // <-- Import arrayUnion
} from "firebase/firestore"
import { useSession } from "@/components/providers/SessionProvider"

type Team = {
  id: string
  orgId: string
  name: string
  members: { uid: string; role: string }[]
}

function TeamsScreen({ theme }: { theme: any }) {
  const { user, isLoading } = useSession()
  const db = getFirestore()

  const [teams, setTeams] = useState<Team[]>([])
  const [userOrgs, setUserOrgs] = useState<
    { orgId: string; orgName: string; role: string }[]
  >([])

  const [showAddTeamDialog, setShowAddTeamDialog] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)

  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false)
  const [targetTeam, setTargetTeam] = useState<Team | null>(null)

  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"member" | "manager">(
    "member"
  )

  useEffect(() => {
    if (!user) return
    loadUserOrgs()
  }, [user])

  useEffect(() => {
    if (userOrgs.length > 0) {
      loadTeamsForUserOrgs()
    } else {
      setTeams([])
    }
  }, [userOrgs])

  async function loadUserOrgs() {
    if (!user) return
    try {
      const userDocRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userDocRef)
      if (userSnap.exists()) {
        const userData = userSnap.data()
        setUserOrgs(userData.organizations ?? [])
      }
    } catch (err) {
      console.error("Error loading user orgs:", err)
    }
  }

  const loadTeamsForUserOrgs = async () => {
    try {
      const allTeams: Team[] = []

      for (const org of userOrgs) {
        const qTeams = query(
          collection(db, "teams"),
          where("orgId", "==", org.orgId)
        )
        const snapshot = await getDocs(qTeams)
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Omit<Team, "id">
          allTeams.push({
            id: docSnap.id,
            orgId: data.orgId,
            name: data.name,
            members: data.members ?? [],
          })
        })
      }

      setTeams(allTeams)
    } catch (error) {
      console.error("Error loading teams:", error)
    }
  }

  const userTeams = teams.slice().sort((a, b) => {
    const userInA = a.members.some((m) => m.uid === user?.uid)
    const userInB = b.members.some((m) => m.uid === user?.uid)
    if (userInA && !userInB) return -1 // A first
    if (!userInA && userInB) return 1 // B first
    return a.name.localeCompare(b.name) // Otherwise, alphabetical
  })

  const isOrgAdmin = (orgId: string): boolean => {
    const membership = userOrgs.find((o) => o.orgId === orgId)
    return membership?.role === "admin"
  }

  const handleCreateTeam = async () => {
    if (!selectedOrgId || !newTeamName) return

    try {
      const newTeamRef = await addDoc(collection(db, "teams"), {
        orgId: selectedOrgId,
        name: newTeamName,
        members: [], // initially empty
      })
      console.log("Created new team:", newTeamRef.id)

      await loadTeamsForUserOrgs()
    } catch (error) {
      console.error("Error creating new team:", error)
    }

    setNewTeamName("")
    setSelectedOrgId(null)
    setShowAddTeamDialog(false)
  }

  const handleAddMember = async () => {
    if (!targetTeam || !newMemberEmail.trim()) return

    try {
      // 1. Find the user doc by email
      const q = query(
        collection(db, "users"),
        where("email", "==", newMemberEmail.trim().toLowerCase())
      )
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        Alert.alert("User Not Found", "No user exists with that email.")
        return
      }

      // 2. Extract the user document ID (which should match the user's UID)
      const userDoc = snapshot.docs[0]
      const foundUserId = userDoc.id

      // 3. Update the team's members
      const updatedTeam: Team = {
        ...targetTeam,
        members: [
          ...targetTeam.members,
          { uid: foundUserId, role: newMemberRole },
        ],
      }

      await updateDoc(doc(db, "teams", targetTeam.id), {
        members: updatedTeam.members,
      })

      // 4. Also update the user document to include this team's ID in their teamIds array
      //    If the `teamIds` field doesn’t exist yet, `arrayUnion` will create it.
      const userDocRef = doc(db, "users", foundUserId)
      await updateDoc(userDocRef, {
        teamIds: arrayUnion(targetTeam.id),
      })

      // 5. Update local state to reflect the new member in the team
      setTeams((prev) =>
        prev.map((t) => (t.id === targetTeam.id ? updatedTeam : t))
      )
    } catch (error) {
      console.error("Error adding member to team:", error)
      Alert.alert("Error", "Failed to add member. Please try again.")
    }

    setNewMemberEmail("")
    setNewMemberRole("member")
    setTargetTeam(null)
    setShowAddMemberDialog(false)
  }

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 16,
        }}
      >
        <Subheading>Loading data...</Subheading>
      </View>
    )
  }

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: theme.colors.background,
          padding: 16,
        }}
      >
        <Subheading>Please sign in to view the Teams page.</Subheading>
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <Card style={styles.card}>
        <Card.Title title="Teams" />
        <Card.Content>
          {userTeams.map((team) => {
            const matchingOrg = userOrgs.find((o) => o.orgId === team.orgId)
            const orgName = matchingOrg ? matchingOrg.orgName : team.orgId // fallback to ID if not found

            const userInTeam = team.members.some((m) => m.uid === user.uid)

            return (
              <View
                key={team.id}
                style={[
                  styles.teamRow,
                  userInTeam && { backgroundColor: "#e3f2fd" },
                ]}
              >
                <List.Item
                  title={team.name}
                  description={`Org: ${orgName}`}
                  onPress={() => {}}
                />
                {isOrgAdmin(team.orgId) && (
                  <IconButton
                    icon="account-multiple-plus"
                    onPress={() => {
                      setTargetTeam(team)
                      setShowAddMemberDialog(true)
                    }}
                  />
                )}
              </View>
            )
          })}

          {userOrgs.some((o) => o.role === "admin") && (
            <Button
              icon="plus"
              mode="outlined"
              style={{ marginTop: 16 }}
              onPress={() => setShowAddTeamDialog(true)}
            >
              Create New Team
            </Button>
          )}
        </Card.Content>
      </Card>

      {/* CREATE TEAM DIALOG */}
      <Portal>
        <Dialog
          visible={showAddTeamDialog}
          onDismiss={() => setShowAddTeamDialog(false)}
        >
          <Dialog.Title>Create Team</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Team Name"
              value={newTeamName}
              onChangeText={setNewTeamName}
              style={{ marginBottom: 8 }}
            />

            <Subheading style={{ marginTop: 8 }}>
              Choose Organization:
            </Subheading>
            {userOrgs
              .filter((o) => o.role === "admin") // only orgs user is admin of
              .map((o) => (
                <List.Item
                  key={o.orgId}
                  title={o.orgName}
                  onPress={() => setSelectedOrgId(o.orgId)}
                  left={() => (
                    <RadioButton
                      status={
                        selectedOrgId === o.orgId ? "checked" : "unchecked"
                      }
                      onPress={() => setSelectedOrgId(o.orgId)}
                      value={o.orgId}
                    />
                  )}
                />
              ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddTeamDialog(false)}>Cancel</Button>
            <Button
              onPress={handleCreateTeam}
              disabled={!selectedOrgId || !newTeamName}
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* ADD MEMBER DIALOG */}
      <Portal>
        <Dialog
          visible={showAddMemberDialog}
          onDismiss={() => setShowAddMemberDialog(false)}
        >
          <Dialog.Title>Add Member</Dialog.Title>
          <Dialog.Content>
            {targetTeam && (
              <>
                <Text style={{ marginBottom: 8 }}>
                  Add a member to team: {targetTeam.name}
                </Text>
                <TextInput
                  label="New Member Email"
                  value={newMemberEmail}
                  onChangeText={setNewMemberEmail}
                  style={{ marginBottom: 8 }}
                />
                <Subheading style={{ marginBottom: 8 }}>Role:</Subheading>
                <RadioButton.Group
                  onValueChange={(val) =>
                    setNewMemberRole(val as "member" | "manager")
                  }
                  value={newMemberRole}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RadioButton value="member" />
                    <Text>Member</Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <RadioButton value="manager" />
                    <Text>Manager</Text>
                  </View>
                </RadioButton.Group>
              </>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddMemberDialog(false)}>
              Cancel
            </Button>
            <Button onPress={handleAddMember} disabled={!newMemberEmail.trim()}>
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
  teamRow: {
    flexDirection: "row",
    alignItems: "center",
  },
})

export default withTheme(TeamsScreen)
