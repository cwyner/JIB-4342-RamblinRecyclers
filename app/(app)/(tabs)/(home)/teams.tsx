import React, { useEffect, useState, useMemo } from "react"
import {
  ScrollView,
  View,
  StyleSheet,
  Alert,
  FlatList,
} from "react-native"
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
  Avatar,
  Divider,
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
  arrayUnion,
} from "firebase/firestore"
import { useSession } from "@/components/providers/SessionProvider"

type Team = {
  id: string
  orgId: string
  name: string
  members: { uid: string; role: string }[]
}

export default withTheme(function TeamsScreen({ theme }: { theme: any }) {
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

  const [showManageTeamDialog, setShowManageTeamDialog] = useState(false)
  const [memberNames, setMemberNames] = useState<Record<string,string>>({})

  const [newMemberEmail, setNewMemberEmail] = useState("")
  const [newMemberRole, setNewMemberRole] = useState<"member" | "manager">(
    "member"
  )

  // — Load user’s orgs
  useEffect(() => {
    if (user) loadUserOrgs()
  }, [user])

  const loadUserOrgs = async () => {
    try {
      const snap = await getDoc(doc(db, "users", user.uid))
      setUserOrgs(snap.exists() ? snap.data().organizations ?? [] : [])
    } catch (err) {
      console.error(err)
    }
  }

  // — Load teams once we know orgs
  useEffect(() => {
    if (userOrgs.length) loadTeams()
    else setTeams([])
  }, [userOrgs])

  const loadTeams = async () => {
    try {
      const all: Team[] = []
      await Promise.all(
        userOrgs.map(async (o) => {
          const q = query(collection(db, "teams"), where("orgId", "==", o.orgId))
          const snap = await getDocs(q)
          snap.forEach(docSnap =>
            all.push({ id: docSnap.id, ...(docSnap.data() as Omit<Team, "id">) })
          )
        })
      )
      setTeams(all)
    } catch (err) {
      console.error(err)
    }
  }

  const isOrgAdmin = (orgId: string) =>
    userOrgs.find(o => o.orgId === orgId)?.role === "admin"

  // — Fetch display names for members
  const getMemberNames = async (team: Team) => {
    const names: Record<string,string> = {}
    await Promise.all(
      team.members.map(async m => {
        const snap = await getDoc(doc(db, "users", m.uid))
        if (snap.exists()) {
          const d = snap.data()
          names[m.uid] = `${d.firstName} ${d.lastName}`
        }
      })
    )
    setMemberNames(names)
  }

  // — Handlers to open dialogs
  const onManageTeam = async (team: Team) => {
    await getMemberNames(team)
    setTargetTeam(team)
    setShowManageTeamDialog(true)
  }

  // — Add member
  const handleAddMember = async () => {
    if (!targetTeam || !newMemberEmail.trim()) return
    try {
      const userSnap = await getDocs(
        query(
          collection(db, "users"),
          where("email", "==", newMemberEmail.trim().toLowerCase())
        )
      )
      if (userSnap.empty) {
        Alert.alert("User Not Found")
        return
      }
      const uid = userSnap.docs[0].id
      const updated = [
        ...targetTeam.members,
        { uid, role: newMemberRole },
      ]
      await updateDoc(doc(db, "teams", targetTeam.id), { members: updated })
      setTeams(ts => ts.map(t => t.id === targetTeam.id ? {...t, members: updated } : t))
      setShowAddMemberDialog(false)
      setNewMemberEmail("")
    } catch (err) {
      console.error(err)
      Alert.alert("Error adding member")
    }
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer(theme)}>
        <Subheading>Loading teams…</Subheading>
      </View>
    )
  }
  if (!user) {
    return (
      <View style={styles.loadingContainer(theme)}>
        <Subheading>Please sign in to view your teams.</Subheading>
      </View>
    )
  }

  return (
    <ScrollView style={styles.root(theme)}>
      <FlatList
        data={teams}
        keyExtractor={t => t.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item: team }) => {
          const orgName = userOrgs.find(o => o.orgId === team.orgId)?.orgName
          const youAreIn = team.members.some(m => m.uid === user.uid)
          return (
            <Card
              style={[
                styles.teamCard,
                youAreIn && { backgroundColor: theme.colors.primaryLight },
              ]}
              elevation={4}
            >
              <Card.Title
                title={team.name}
                subtitle={orgName}
                left={props => <Avatar.Icon {...props} icon="account-group" />}
                right={props => isOrgAdmin(team.orgId) && (
                  <IconButton
                    {...props}
                    icon="account-multiple-plus"
                    onPress={() => {
                      setTargetTeam(team)
                      setShowAddMemberDialog(true)
                    }}
                  />
                )}
              />
              <Divider />
              <Card.Actions style={styles.cardActions}>
                <Button
                  mode="text"
                  onPress={() => onManageTeam(team)}
                  compact
                >
                  Manage
                </Button>
                {youAreIn && (
                  <Button
                    mode="contained"
                    onPress={() => {/* maybe navigate to tasks */}}
                  >
                    Your Tasks
                  </Button>
                )}
              </Card.Actions>
            </Card>
          )
        }}
        ListEmptyComponent={() => (
          <View style={{ padding: 32, alignItems: "center" }}>
            <Text>No teams yet.</Text>
          </View>
        )}
      />

      {isOrgAdmin("") && (
        <Button
          icon="plus"
          mode="contained"
          style={styles.createButton}
          onPress={() => setShowAddTeamDialog(true)}
        >
          Create Team
        </Button>
      )}

      {/* Create Team Dialog */}
      <Portal>
        <Dialog
          visible={showAddTeamDialog}
          onDismiss={() => setShowAddTeamDialog(false)}
        >
          <Dialog.Title>Create New Team</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Team Name"
              value={newTeamName}
              onChangeText={setNewTeamName}
              style={styles.dialogInput}
            />
            <Subheading>Select Organization</Subheading>
            {userOrgs
              .filter(o => o.role === "admin")
              .map(o => (
                <List.Item
                  key={o.orgId}
                  title={o.orgName}
                  onPress={() => setSelectedOrgId(o.orgId)}
                  left={() => (
                    <RadioButton
                      status={selectedOrgId === o.orgId ? "checked" : "unchecked"}
                    />
                  )}
                />
              ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddTeamDialog(false)}>Cancel</Button>
            <Button
              onPress={async () => {
                if (selectedOrgId && newTeamName) {
                  await addDoc(collection(db, "teams"), {
                    orgId: selectedOrgId,
                    name: newTeamName,
                    members: [],
                  })
                  loadTeams()
                  setShowAddTeamDialog(false)
                  setNewTeamName("")
                  setSelectedOrgId(null)
                }
              }}
              disabled={!selectedOrgId || !newTeamName.trim()}
            >
              Create
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Add Member Dialog */}
      <Portal>
        <Dialog
          visible={showAddMemberDialog}
          onDismiss={() => setShowAddMemberDialog(false)}
        >
          <Dialog.Title>Add Member to {targetTeam?.name}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Member Email"
              value={newMemberEmail}
              onChangeText={setNewMemberEmail}
              style={styles.dialogInput}
            />
            <Subheading>Select Role</Subheading>
            <RadioButton.Group
              onValueChange={val => setNewMemberRole(val as any)}
              value={newMemberRole}
            >
              {["member", "manager"].map(r => (
                <View key={r} style={styles.radioRow}>
                  <RadioButton value={r} />
                  <Text>{r.charAt(0).toUpperCase() + r.slice(1)}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowAddMemberDialog(false)}>Cancel</Button>
            <Button onPress={handleAddMember} disabled={!newMemberEmail.trim()}>
              Add
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Manage Team Dialog */}
      <Portal>
        <Dialog
          visible={showManageTeamDialog}
          onDismiss={() => setShowManageTeamDialog(false)}
        >
          <Dialog.Title>Team Members</Dialog.Title>
          <Dialog.Content>
            {(targetTeam?.members || []).map(m => (
              <List.Item
                key={m.uid}
                title={memberNames[m.uid] || "Loading..."}
                description={m.role}
                left={props => <Avatar.Text {...props} label={m.role.charAt(0).toUpperCase()} />}
              />
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowManageTeamDialog(false)}>Close</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  )
})

const styles = StyleSheet.create({
  root: (theme: any) => ({
    flex: 1,
    backgroundColor: theme.colors.background,
  }),
  loadingContainer: (theme: any) => ({
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 16,
  }),
  teamCard: {
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  cardActions: {
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  createButton: {
    margin: 16,
    borderRadius: 24,
    elevation: 2,
    backgroundColor: '#6200ee',
  },
  dialogInput: {
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
})
