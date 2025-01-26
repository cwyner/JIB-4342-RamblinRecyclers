import React from "react";
import { View } from "react-native";
import {
  withTheme,
} from "react-native-paper";

function Home({ theme }: { theme: any }) {
  return (
    <View style={{ flex: 1 }}>
    </View>
  );
}
export default withTheme(Home);