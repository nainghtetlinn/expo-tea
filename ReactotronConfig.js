import AsyncStorage from "@react-native-async-storage/async-storage";
import Reactotron from "reactotron-react-native";

Reactotron.configure({ name: "Tea Mixer" })
  .setAsyncStorageHandler(AsyncStorage)
  .useReactNative()
  .connect();
