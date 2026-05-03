import { Alert, PermissionsAndroid, Platform } from "react-native";

export const requestBLEPermissions = async () => {
  if (Platform.OS === "android") {
    try {
      if (Platform.Version >= 31) {
        // Android 12+
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);

        const allGranted =
          granted["android.permission.BLUETOOTH_SCAN"] === "granted" &&
          granted["android.permission.BLUETOOTH_CONNECT"] === "granted" &&
          granted["android.permission.ACCESS_FINE_LOCATION"] === "granted";

        if (!allGranted) {
          Alert.alert(
            "Permission Required",
            "BLE permissions are required to scan and connect to devices.",
          );
        }

        return allGranted;
      } else {
        // Android < 12
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Permission Required",
            "Location permission is required to scan BLE devices.",
          );
        }

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  }
  // iOS handles permissions automatically through infoPlist
  return true;
};
