import HomeScreen from "@/screens/home-screen";
import { useBluetoothContext } from "@/utils/bluetooth-context";

export default function HomeTabScreen() {
  const { sendJson } = useBluetoothContext();

  return <HomeScreen />;
}
