import { Tabs } from "expo-router"

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="(home)"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="(materials)"
                options={{
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="(receiving)"
                options={{
                    headerShown: false,
                }}
            />
        </Tabs>
    )
}