import { useTranslation } from "react-i18next";
import { Text as PaperText, TextProps } from "react-native-paper";

const MYANMAR_LINE_HEIGHT = 26;

export function LocalizedText(props: TextProps<never>) {
  const { i18n } = useTranslation();
  const lineHeightStyle =
    i18n.resolvedLanguage === "my"
      ? { lineHeight: MYANMAR_LINE_HEIGHT }
      : undefined;
  return <PaperText {...props} style={[props.style, lineHeightStyle]} />;
}
