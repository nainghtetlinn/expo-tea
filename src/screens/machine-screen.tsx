import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  ProgressBar,
  SegmentedButtons,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { MachineTeaCard } from "@/components/tea-card";
import { DeviceService } from "@/services/device";
import { useDeviceStore } from "@/stores/device-store";

export function MachineScreen() {
  const {
    buttonInfos,
    deviceInfo,
    isCleaning,
    cleaningProgress,
    cleaningRemainingSeconds,
    cleaningFinished,
  } = useDeviceStore();
  const theme = useTheme();
  const { t } = useTranslation();
  const [localMl, setLocalMl] = useState(
    deviceInfo?.targetTotalMl?.toString() ?? "",
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    DeviceService.send.getButtonsInfo();
    DeviceService.send.getDeviceInfo();

    const interval = setInterval(() => {
      DeviceService.send.getTemperature();
      DeviceService.send.getWeight();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Keep local input in sync when device pushes a new value
  useEffect(() => {
    if (deviceInfo?.targetTotalMl !== undefined) {
      setLocalMl(deviceInfo.targetTotalMl.toString());
    }
  }, [deviceInfo?.targetTotalMl]);

  const handleMlChange = (text: string) => {
    setLocalMl(text);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const value = parseInt(text, 10);
      if (!Number.isNaN(value) && value > 0) {
        DeviceService.send.setTargetTotalMl(value);
      }
    }, 600);
  };

  if (!buttonInfos)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>
    );

  return (
    <ScrollView className="flex-1" contentContainerClassName="gap-4 p-4">
      {/* Device Info */}
      {deviceInfo ? (
        <Surface
          mode="flat"
          style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
        >
          <View className="flex-row items-center justify-between p-4">
            <Text variant="titleMedium">{t("machine.temperature")}</Text>
            <Text variant="bodyMedium">
              {deviceInfo.temperature.toFixed(1)} °C
            </Text>
          </View>
          <View className="flex-row items-center justify-between px-4 pb-4">
            <Text variant="titleMedium">{t("machine.weight")}</Text>
            <Text variant="bodyMedium">{deviceInfo.weight.toFixed(1)} g</Text>
          </View>
          <View className="flex-row items-center justify-between px-4 pb-4">
            <Text variant="titleMedium">{t("machine.calibrationFactor")}</Text>
            <Text variant="bodyMedium">
              {deviceInfo.calibrationFactor.toFixed(2)}
            </Text>
          </View>
          <View className="flex-row items-center justify-between px-4 pb-4">
            <Text variant="titleMedium">{t("machine.cupWeight")}</Text>
            <Text variant="bodyMedium">
              {deviceInfo.cupWeight.toFixed(1)} g
            </Text>
          </View>
        </Surface>
      ) : (
        <Surface
          mode="flat"
          style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
        >
          <View className="items-center p-4">
            <ActivityIndicator size="small" />
          </View>
        </Surface>
      )}

      {/* Serving Size Limit */}
      <Surface
        mode="flat"
        style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
      >
        <View className="flex-row items-center justify-between p-4">
          <Text variant="titleMedium">{t("machine.servingSizeLimit")}</Text>
          <TextInput
            activeOutlineColor={theme.colors.primary}
            activeUnderlineColor={theme.colors.primary}
            dense
            keyboardType="number-pad"
            mode="outlined"
            onChangeText={handleMlChange}
            outlineColor={theme.colors.outlineVariant}
            outlineStyle={{ borderRadius: 8 }}
            right={<TextInput.Affix text="ml" />}
            style={{
              minWidth: 100,
              backgroundColor: "transparent",
              textAlign: "right",
            }}
            underlineColor="transparent"
            value={localMl}
          />
        </View>
      </Surface>

      <Surface
        mode="flat"
        style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
      >
        <View className="flex flex-col gap-4 p-4">
          <Text variant="titleMedium">{t("machine.dispensingMode")}</Text>
          <SegmentedButtons
            buttons={[
              {
                value: "time",
                label: t("machine.time"),
                icon: "timer-outline",
              },
              {
                value: "weight",
                label: t("machine.weight"),
                icon: "scale-balance",
              },
            ]}
            onValueChange={(value) =>
              DeviceService.send.setDispensingMode(value === "weight")
            }
            value={deviceInfo?.weightMode ? "weight" : "time"}
          />
        </View>
      </Surface>

      {/* Cleaning Mode */}
      <Surface
        mode="flat"
        style={{ borderRadius: theme.roundness * 3, overflow: "hidden" }}
      >
        <View className="flex flex-col gap-4 p-4">
          <Text variant="titleMedium">{t("machine.cleaningMode")}</Text>

          {isCleaning ? (
            <>
              <View className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Text
                    style={{ color: theme.colors.onSurfaceVariant }}
                    variant="bodySmall"
                  >
                    {t("machine.cleaningInProgress")}
                  </Text>
                  <Text
                    style={{ color: theme.colors.onSurfaceVariant }}
                    variant="bodySmall"
                  >
                    {cleaningRemainingSeconds}s
                  </Text>
                </View>
                <ProgressBar
                  color={theme.colors.primary}
                  progress={cleaningProgress / 100}
                  style={{ borderRadius: 4, height: 8 }}
                />
                <Text
                  style={{
                    color: theme.colors.onSurfaceVariant,
                    textAlign: "right",
                  }}
                  variant="bodySmall"
                >
                  {Math.round(cleaningProgress)}%
                </Text>
              </View>
              <Button
                icon="close-circle-outline"
                mode="outlined"
                onPress={() => DeviceService.send.cancelCleaning()}
                style={{ borderColor: theme.colors.error }}
                textColor={theme.colors.error}
              >
                {t("machine.cancelCleaning")}
              </Button>
            </>
          ) : cleaningFinished ? (
            <>
              <View className="flex-row items-center gap-2">
                <Text
                  style={{ color: theme.colors.primary }}
                  variant="bodyMedium"
                >
                  {t("machine.cleaningFinished")}
                </Text>
              </View>
              <Button
                icon="spray-bottle"
                mode="contained"
                onPress={() => DeviceService.send.startCleaning()}
              >
                {t("machine.startCleaning")}
              </Button>
            </>
          ) : (
            <Button
              icon="spray-bottle"
              mode="contained"
              onPress={() => DeviceService.send.startCleaning()}
            >
              {t("machine.startCleaning")}
            </Button>
          )}
        </View>
      </Surface>

      {/* Machine Button Cards */}
      <MachineTeaCard btnIndex={0} info={buttonInfos.btn0} />
      <MachineTeaCard btnIndex={1} info={buttonInfos.btn1} />
      <MachineTeaCard btnIndex={2} info={buttonInfos.btn2} />
    </ScrollView>
  );
}
