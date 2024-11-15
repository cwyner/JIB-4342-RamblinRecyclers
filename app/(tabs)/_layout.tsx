import React from "react";
import { Tabs } from "expo-router";
import { withTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";

function TabLayout({ theme }) {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceDisabled,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "(home)") {
            iconName = "home";
          } else if (route.name === "(materials)") {
            iconName = "layers";
          } else if (route.name === "(receiving)") {
            iconName = "inbox";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="(materials)"
        options={{
          headerShown: false,
          tabBarLabel: "Materials",
        }}
      />
      <Tabs.Screen
        name="(receiving)"
        options={{
          headerShown: false,
          tabBarLabel: "Receiving",
        }}
      />
    </Tabs>
  );
}

export default withTheme(TabLayout)