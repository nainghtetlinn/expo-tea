import "@/global.css";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import {
  configureFonts,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Portal,
  Snackbar,
} from "react-native-paper";
import "react-native-reanimated";
import { useIsDark } from "@/hooks/use-is-dark";
import { BluetoothManager } from "@/services/bluetooth";
import { DeviceManager } from "@/services/device";
import { usePreferencesStore } from "@/stores/preferences-store";
import { useSnackbarStore } from "@/stores/snackbar-store";
import { useTeaStore } from "@/stores/tea-store";
import { useWalkthroughStore } from "@/stores/walkthrough-store";

if (__DEV__) {
  import("../../ReactotronConfig");
}

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
  const initialize = useTeaStore((state) => state.initialize);
  const walkthroughHydrated = useWalkthroughStore(
    (state) => state._hasHydrated,
  );

  const isReady = loaded && walkthroughHydrated;

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isReady) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const isDark = useIsDark();
  const language = usePreferencesStore((state) => state.language);
  const { visible, text, hide } = useSnackbarStore();

  const paperTheme = {
    ...(isDark ? MD3DarkTheme : MD3LightTheme),
    fonts: language === "en" ? configureFonts() : fontConfig,
  };

  return (
    <PaperProvider theme={paperTheme}>
      <ThemeProvider
        value={isDark ? NavigationDarkTheme : NavigationDefaultTheme}
      >
        <BluetoothManager />
        <DeviceManager />
        <Portal>
          <Snackbar
            duration={3000}
            key={text}
            onDismiss={hide}
            onIconPress={hide}
            style={{
              bottom: 50,
            }}
            visible={visible}
          >
            {text}
          </Snackbar>
        </Portal>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen
            name="languages"
            options={{
              title: "Languages",
            }}
          />
          <Stack.Screen
            name="bluetooth"
            options={{
              title: "Bluetooth",
            }}
          />
          <Stack.Screen
            name="machine"
            options={{
              title: "Machine",
            }}
          />
          <Stack.Screen
            name="terms"
            options={{
              title: "Terms & Conditions",
            }}
          />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </PaperProvider>
  );
}
