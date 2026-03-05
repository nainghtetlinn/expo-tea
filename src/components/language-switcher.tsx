import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { SegmentedButtons, Text } from "react-native-paper";

const langs = {
  en: { nativeName: "English" },
  my: { nativeName: "မြန်မာ" },
};

export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();

  return (
    <View style={styles.container}>
      <Text variant="labelMedium">{t("ui.switch")}</Text>
      <SegmentedButtons
        value={i18n.resolvedLanguage || "en"}
        onValueChange={i18n.changeLanguage}
        buttons={Object.entries(langs).map(([k, v]) => ({
          value: k,
          label: v.nativeName,
        }))}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
});
