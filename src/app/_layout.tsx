import "@/global.css";
import { BluetoothContextProvider } from "@/lib/bluetooth-context";
import { TeaContextProvider } from "@/lib/tea-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { configureFonts, PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import i18n, { LANGUAGE_STORAGE_KEY } from "../i18n";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const fontConfig = configureFonts({
  config: {
    displayLarge: {
      lineHeight: 90,
    },
    displayMedium: {
      lineHeight: 70,
    },
    displaySmall: {
      lineHeight: 56,
    },
    headlineLarge: {
      lineHeight: 50,
    },
    headlineMedium: {
      lineHeight: 44,
    },
    headlineSmall: {
      lineHeight: 38,
    },
    titleLarge: {
      lineHeight: 36,
    },
    titleMedium: {
      lineHeight: 28,
    },
    titleSmall: {
      lineHeight: 24,
    },
    labelLarge: {
      lineHeight: 24,
    },
    labelMedium: {
      lineHeight: 20,
    },
    labelSmall: {
      lineHeight: 20,
    },
    bodyLarge: {
      lineHeight: 28,
    },
    bodyMedium: {
      lineHeight: 24,
    },
    bodySmall: {
      lineHeight: 20,
    },
  },
  isV3: true,
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then((savedLang) => {
        if (savedLang && savedLang !== i18n.resolvedLanguage) {
          i18n.changeLanguage(savedLang);
        }
      })
      .catch((error) => {
        console.error("Failed to load saved language:", error);
      });
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { i18n } = useTranslation();

  return (
    <BluetoothContextProvider>
      <TeaContextProvider>
        <PaperProvider
          theme={{
            version: 3,
            dark: false,
            fonts:
              i18n.resolvedLanguage == "en" ? configureFonts() : fontConfig,
          }}
        >
          <Stack>
            <Stack.Screen name="index" />
            <Stack.Screen
              name="languages"
              options={{
                title: "Languages",
                headerShown: false,
              }}
            />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </PaperProvider>
      </TeaContextProvider>
    </BluetoothContextProvider>
  );
}
