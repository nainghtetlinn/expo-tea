import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Keyboard, type KeyboardEvent, ScrollView, View } from "react-native";
import {
  Button,
  Dialog,
  HelperText,
  Portal,
  TextInput,
} from "react-native-paper";
import { z } from "zod";

export const recipeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  tea: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Tea ml must be 0 or more"),
  ),
  condensedMilk: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Condensed Milk ml must be 0 or more"),
  ),
  evaporatedMilk: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Evaporated Milk ml must be 0 or more"),
  ),
  milk: z.preprocess(
    (val) => Number(val),
    z.number().min(0, "Milk ml must be 0 or more"),
  ),
});

export type RecipeFormValues = z.infer<typeof recipeSchema>;

const defaultRecipe: RecipeFormValues = {
  name: "",
  description: "",
  tea: 0,
  condensedMilk: 0,
  evaporatedMilk: 0,
  milk: 0,
};

export function TeaRecipeFormDialog({
  defaultValues,
  title = "Add Custom Recipe",
  submitLabel = "Add",
  visible,
  onClose,
  onSubmit,
}: {
  defaultValues?: RecipeFormValues;
  title: string;
  submitLabel: string;
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: RecipeFormValues) => void | Promise<void>;
}) {
  const { t } = useTranslation();

  const [dialogBottom, setDialogBottom] = useState(0);

  const form = useForm({
    resolver: zodResolver(recipeSchema),
    defaultValues: defaultValues ?? defaultRecipe,
  });

  useEffect(() => {
    if (visible) {
      form.reset(defaultValues ?? defaultRecipe);
    }
  }, [defaultValues, form, visible]);

  const onKeyboardChange = (e: KeyboardEvent) => {
    setDialogBottom(e.endCoordinates.height / 2);
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", onKeyboardChange);
    const hideSub = Keyboard.addListener("keyboardDidHide", onKeyboardChange);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <Portal>
      <Dialog
        onDismiss={onClose}
        style={{ bottom: dialogBottom }}
        visible={visible}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView className="max-h-64">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <View>
                  <TextInput
                    className="mb-2"
                    error={fieldState.invalid}
                    label={"Name"}
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    ref={field.ref}
                    value={field.value}
                  />

                  <HelperText type="error" visible={fieldState.invalid}>
                    {fieldState.error?.message}
                  </HelperText>
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <View>
                  <TextInput
                    className="mb-2"
                    error={fieldState.invalid}
                    label={"Description"}
                    multiline
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    ref={field.ref}
                    value={field.value}
                  />
                  <HelperText type="error" visible={fieldState.invalid}>
                    {fieldState.error?.message}
                  </HelperText>
                </View>
              )}
            />

            <Controller
              control={form.control}
              name="tea"
              render={({ field, fieldState }) => (
                <View>
                  <TextInput
                    className="mb-2"
                    error={fieldState.invalid}
                    label={"Tea (ml)"}
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    ref={field.ref}
                    value={String(field.value)}
                  />
                  <HelperText type="error" visible={fieldState.invalid}>
                    {fieldState.error?.message}
                  </HelperText>
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="condensedMilk"
              render={({ field, fieldState }) => (
                <View>
                  <TextInput
                    className="mb-2"
                    error={fieldState.invalid}
                    label={"Condensed Milk (ml)"}
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    ref={field.ref}
                    value={String(field.value)}
                  />
                  <HelperText type="error" visible={fieldState.invalid}>
                    {fieldState.error?.message}
                  </HelperText>
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="evaporatedMilk"
              render={({ field, fieldState }) => (
                <View>
                  <TextInput
                    className="mb-2"
                    error={fieldState.invalid}
                    label={"Evaporated Milk (ml)"}
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    ref={field.ref}
                    value={String(field.value)}
                  />
                  <HelperText type="error" visible={fieldState.invalid}>
                    {fieldState.error?.message}
                  </HelperText>
                </View>
              )}
            />
            <Controller
              control={form.control}
              name="milk"
              render={({ field, fieldState }) => (
                <View>
                  <TextInput
                    className="mb-2"
                    error={fieldState.invalid}
                    label={"Milk (ml)"}
                    onBlur={field.onBlur}
                    onChangeText={field.onChange}
                    ref={field.ref}
                    value={String(field.value)}
                  />
                  <HelperText type="error" visible={fieldState.invalid}>
                    {fieldState.error?.message}
                  </HelperText>
                </View>
              )}
            />
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={onClose}>{t("Cancel")}</Button>
          <Button
            onPress={form.handleSubmit(async (d) => {
              await onSubmit(d);
            })}
          >
            {submitLabel}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
