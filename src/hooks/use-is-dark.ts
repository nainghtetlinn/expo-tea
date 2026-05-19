import { useColorScheme } from "react-native";
import { usePreferencesStore } from "@/stores/preferences-store";

export const useIsDark = () => {
  const systemColorScheme = useColorScheme();
  const theme = usePreferencesStore((state) => state.theme);
  return theme === "system" ? systemColorScheme === "dark" : theme === "dark";
};
