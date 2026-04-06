import { useBluetoothContext } from "@/lib/bluetooth-context";
import { HomeScreen } from "@/screens/home-screen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, View } from "react-native";
import { Device, State } from "react-native-ble-plx";
import {
  ActivityIndicator,
  Appbar,
  Button,
  Dialog,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";

export default function HomeTab() {
  const theme = useTheme();
  const { t } = useTranslation();
  const {
    bleState,
    connectedDevice,
    isScanning,
    foundDevices,
    connectingDeviceId,
    startScanning,
    stopScanning,
    connectToDevice,
  } = useBluetoothContext();
  const [show, setShow] = useState(false);

  const handleBluetooth = () => {
    if (connectedDevice) return;
    if (bleState == State.PoweredOn) setShow(true);
    if (isScanning) return;
    startScanning();
    setTimeout(stopScanning, 15000);
  };

  const handleScanning = () => {
    startScanning();
    setTimeout(stopScanning, 15000);
  };

  useEffect(() => {
    if (connectedDevice) setShow(false);
  }, [connectedDevice]);

  return (
    <>
      <Portal>
        <Dialog visible={show} onDismiss={() => setShow(false)}>
          <Dialog.Title>{t("home.Found Devices")}</Dialog.Title>
          <Dialog.Content>
            <View className="h-60">
              <View className="flex-row items-center justify-between">
                <Text variant="bodyLarge" style={{ paddingVertical: 8 }}>
                  Available Devices
                </Text>
                {isScanning ? (
                  <ActivityIndicator />
                ) : (
                  <Button compact onPress={handleScanning}>
                    Refresh
                  </Button>
                )}
              </View>

              <FlatList
                data={foundDevices}
                keyExtractor={(item) => item.id}
                contentContainerClassName="gap-4"
                renderItem={({ item }: { item: Device }) => {
                  return (
                    <Button
                      loading={connectingDeviceId === item.id}
                      disabled={connectingDeviceId === item.id}
                      mode="contained-tonal"
                      icon={(props) => (
                        <MaterialIcons name="device-unknown" {...props} />
                      )}
                      onPress={() => connectToDevice(item)}
                    >
                      {item.name}
                    </Button>
                  );
                }}
              />
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShow(false)}>{t("Cancel")}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      <View
        className="flex-1"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Appbar.Header mode="center-aligned">
          <Appbar.Content title={t("home.title")} />
          <Appbar.Action
            onPress={handleBluetooth}
            icon={(props) =>
              bleState != State.PoweredOn ? (
                <MaterialIcons name="bluetooth-disabled" {...props} />
              ) : connectedDevice ? (
                <MaterialIcons name="bluetooth-connected" {...props} />
              ) : isScanning ? (
                <MaterialIcons name="bluetooth-searching" {...props} />
              ) : (
                <MaterialIcons name="bluetooth" {...props} />
              )
            }
          />
        </Appbar.Header>

        <HomeScreen />
      </View>
    </>
  );
}
