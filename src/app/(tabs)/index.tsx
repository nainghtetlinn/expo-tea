import { BluetoothDialog } from "@/components/dialogs/bluetooth-dialog";
import { WalkthroughContent } from "@/components/home-walkthrough";
import { useBluetoothContext } from "@/lib/bluetooth-context";
import { useWalkthrough, WalkthroughProvider } from "@/lib/walkthrough-context";
import { HomeScreen } from "@/screens/home-screen";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { State } from "react-native-ble-plx";
import { Appbar, useTheme } from "react-native-paper";
import Tooltip from "react-native-walkthrough-tooltip";

function HomeTabContent() {
  const theme = useTheme();
  const { t } = useTranslation();
  const { bleState, connectedDevice, isScanning, startScanning, stopScanning } =
    useBluetoothContext();
  const [show, setShow] = useState(false);
  const { isStep, skipAll } = useWalkthrough();

  const handleBluetooth = () => {
    if (connectedDevice) return;
    if (bleState == State.PoweredOn) setShow(true);
    if (isScanning) return;
    startScanning();
    setTimeout(stopScanning, 15000);
  };

  useEffect(() => {
    if (connectedDevice) setShow(false);
  }, [connectedDevice]);

  return (
    <>
      <BluetoothDialog visible={show} onClose={() => setShow(false)} />

      <View
        className="flex-1"
        style={{ backgroundColor: theme.colors.background }}
      >
        <Appbar.Header mode="center-aligned">
          <Appbar.Content title={t("home.title")} />

          {/* Step 1: Connect Bluetooth */}
          <Tooltip
            isVisible={isStep(1)}
            content={<WalkthroughContent step={1} />}
            placement="bottom"
            allowChildInteraction={false}
            displayInsets={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
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
          </Tooltip>
        </Appbar.Header>

        <HomeScreen />
      </View>
    </>
  );
}

export default function HomeTab() {
  return (
    <WalkthroughProvider>
      <HomeTabContent />
    </WalkthroughProvider>
  );
}
