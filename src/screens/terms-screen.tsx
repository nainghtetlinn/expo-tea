import { ScrollView, View } from "react-native";
import { Text } from "react-native-paper";

export function TermsScreen() {
  return (
    <ScrollView
      className="flex-1 px-4"
      contentContainerClassName="gap-4 pt-4 pb-8"
    >
      <View className="gap-3">
        <Text variant="titleMedium">Welcome to Tea Mixer</Text>
        <Text variant="bodyMedium">
          By using this app, you agree to these terms. If you do not agree,
          please stop using the app.
        </Text>
      </View>

      <View className="gap-3">
        <Text variant="titleMedium">Use of the App</Text>
        <Text variant="bodyMedium">
          Use the app responsibly. Do not attempt to misuse the Bluetooth
          connection or interfere with device operation.
        </Text>
      </View>

      <View className="gap-3">
        <Text variant="titleMedium">Data & Privacy</Text>
        <Text variant="bodyMedium">
          We only use Bluetooth data to connect and control your tea machine. We
          do not sell your data.
        </Text>
      </View>

      <View className="gap-3">
        <Text variant="titleMedium">Liability</Text>
        <Text variant="bodyMedium">
          The app is provided as-is. We are not responsible for damages caused
          by misuse or hardware faults.
        </Text>
      </View>

      <View className="gap-3">
        <Text variant="titleMedium">Contact</Text>
        <Text variant="bodyMedium">
          If you have questions about these terms, contact the developer.
        </Text>
      </View>
    </ScrollView>
  );
}
