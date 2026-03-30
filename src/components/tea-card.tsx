import { useTeaContext } from "@/lib/tea-context";
import { Tea } from "@/types/tea";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button, Card, Dialog, Portal, Text } from "react-native-paper";
import { TeaCup } from "./tea-cup";

export function TeaCard({ tea }: { tea: Tea }) {
  const { makeTea } = useTeaContext();

  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "my";

  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <Portal>
        <Dialog visible={showConfirm} onDismiss={() => setShowConfirm(false)}>
          <Dialog.Title>{t("tea-card.Confirm Tea Preparation")}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">
              {t("tea-card.Are you sure you want to make this tea", {
                tea: tea.name[lang],
              })}
            </Text>
            <View className="mt-4 gap-2">
              {Object.entries(tea.ingredients)
                .filter(([, v]) => v > 0)
                .map(([k, v]) => (
                  <View
                    key={k}
                    className="flex-row items-center justify-between"
                  >
                    <Text variant="bodySmall">{t(`ingredients.${k}`)}</Text>
                    <Text variant="bodySmall">{v} ml</Text>
                  </View>
                ))}
            </View>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowConfirm(false)}>Cancel</Button>
            <Button onPress={() => makeTea(tea)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Card onPress={() => setShowConfirm(true)}>
        <View className="flex flex-row gap-4 p-4">
          <View className="flex-1">
            <View className="mb-4 flex flex-row gap-4">
              <View className="flex-1">
                <Text variant="titleMedium">{tea.name[lang]}</Text>
                <Text variant="bodySmall">{tea.description[lang]}</Text>
              </View>
              <TeaCup ingredients={tea.ingredients} />
            </View>
            <View className="flex flex-row items-center justify-between">
              {Object.entries(tea.ingredients).map(([k, v]) => (
                <View key={k} className="items-center">
                  <Text variant="bodySmall">{k[0].toUpperCase()}</Text>
                  <Text variant="labelSmall">{v} ml</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Card>
    </>
  );
}
