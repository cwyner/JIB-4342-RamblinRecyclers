import { withTheme } from "react-native-paper";
import { View } from "react-native";
import EditDonations from "@/components/ui/EditDonations"; // Ensure this path is correct

function Materials({ theme }: { theme: any }) {
  return (
    <View>
      <EditDonations />
    </View>
  );
}

export default withTheme(Materials);
