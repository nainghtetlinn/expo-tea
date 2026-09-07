import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { State } from "react-native-ble-plx";
import { Appbar, useTheme } from "react-native-paper";
import { BluetoothDialog } from "@/components/dialogs/bluetooth-dialog";
import OpenSettingDialog from "@/components/dialogs/open-setting-dialog";
import { HomeWalkthroughContent } from "@/components/home-walkthrough-content";
import { HomeScreen } from "@/screens/home-screen";
import { BluetoothService } from "@/services/bluetooth";
import { useBluetoothStore } from "@/stores/bluetooth-store";

function HomeTabContent() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { bleState, connectedDevice, isScanning } = useBluetoothStore();
  const [show, setShow] = useState(false);
  const [showSetting, setShowSetting] = useState(false);

  const handleBluetooth = () => {
    if (connectedDevice) return;
    if (bleState === State.PoweredOn) setShow(true);
    if (bleState === State.PoweredOff) setShowSetting(true);
    if (isScanning) return;

    BluetoothService.startScanning();
    setTimeout(BluetoothService.stopScanning, 15000);
  };

  useEffect(() => {
    if (bleState === State.PoweredOn && showSetting) {
      setShowSetting(false);
      setShow(true);
      BluetoothService.startScanning();
      setTimeout(BluetoothService.stopScanning, 15000);
    }
    if (bleState === State.PoweredOff) {
      setShow(false);
    }
  }, [bleState]);

  useEffect(() => {
    if (connectedDevice) setShow(false);
  }, [connectedDevice]);

  return (
    <>
      <OpenSettingDialog
        onClose={() => setShowSetting(false)}
        visible={showSetting}
      />
      <BluetoothDialog onClose={() => setShow(false)} visible={show} />

      <View
        className="flex-1"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Appbar.Header mode="center-aligned">
          <Appbar.Content title={t("home.title")} />

          {/* Step 1: Connect Bluetooth */}
          <HomeWalkthroughContent step={1}>
            <Appbar.Action
              icon={(props) =>
                bleState !== State.PoweredOn ? (
                  <MaterialIcons name="bluetooth-disabled" {...props} />
                ) : connectedDevice ? (
                  <MaterialIcons name="bluetooth-connected" {...props} />
                ) : isScanning ? (
                  <MaterialIcons name="bluetooth-searching" {...props} />
                ) : (
                  <MaterialIcons name="bluetooth" {...props} />
                )
              }
              onPress={handleBluetooth}
            />
          </HomeWalkthroughContent>
        </Appbar.Header>

        <HomeScreen />
      </View>
    </>
  );
}

export default function HomeTab() {
  return <HomeTabContent />;
}
