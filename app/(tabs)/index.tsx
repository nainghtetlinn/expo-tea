import { useBluetoothContext } from "@/utils/bluetooth-context";
import { StyleSheet, Text } from "react-native";
import { Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeTabScreen() {
  const { sendJson } = useBluetoothContext();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tea Mixer BLE</Text>
      <Button
        onPress={() => {
          sendJson({
            tea: 10,
            milk: 30,
            condensed: 5,
            evaporated: 10,
          });
        }}
      >
        Send
      </Button>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
