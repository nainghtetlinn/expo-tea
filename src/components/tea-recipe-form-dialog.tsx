import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Keyboard, KeyboardEvent, ScrollView, View } from "react-native";
import { Button, Dialog, Portal, Text, TextInput } from "react-native-paper";
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
  title?: string;
  submitLabel?: string;
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: RecipeFormValues) => void | Promise<void>;
}) {
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
        style={{ bottom: dialogBottom }}
        visible={visible}
        onDismiss={onClose}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.ScrollArea>
          <ScrollView className="max-h-60">
            <View className="gap-2">
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <View>
                    <TextInput
                      label={"Name"}
                      ref={field.ref}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.invalid}
                      className="mb-2"
                    />
                    {fieldState.invalid && (
                      <Text
                        variant="bodySmall"
                        style={{ color: "#B00020", marginBottom: 8 }}
                      >
                        {fieldState.error?.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <View>
                    <TextInput
                      label={"Description"}
                      ref={field.ref}
                      value={field.value}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.invalid}
                      className="mb-2"
                      multiline
                    />
                    {fieldState.invalid && (
                      <Text
                        variant="bodySmall"
                        style={{ color: "#B00020", marginBottom: 8 }}
                      >
                        {fieldState.error?.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>

            <Text variant="titleMedium" className="mt-4 mb-2">
              Ingredients
            </Text>

            <View className="gap-2">
              <Controller
                control={form.control}
                name="tea"
                render={({ field, fieldState }) => (
                  <View>
                    <TextInput
                      label={"Tea (ml)"}
                      ref={field.ref}
                      value={String(field.value)}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.invalid}
                      className="mb-2"
                    />
                    {fieldState.invalid && (
                      <Text
                        variant="bodySmall"
                        style={{ color: "#B00020", marginBottom: 8 }}
                      >
                        {fieldState.error?.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={form.control}
                name="condensedMilk"
                render={({ field, fieldState }) => (
                  <View>
                    <TextInput
                      label={"Condensed Milk (ml)"}
                      ref={field.ref}
                      value={String(field.value)}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.invalid}
                      className="mb-2"
                    />
                    {fieldState.invalid && (
                      <Text
                        variant="bodySmall"
                        style={{ color: "#B00020", marginBottom: 8 }}
                      >
                        {fieldState.error?.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={form.control}
                name="evaporatedMilk"
                render={({ field, fieldState }) => (
                  <View>
                    <TextInput
                      label={"Evaporated Milk (ml)"}
                      ref={field.ref}
                      value={String(field.value)}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.invalid}
                      className="mb-2"
                    />
                    {fieldState.invalid && (
                      <Text
                        variant="bodySmall"
                        style={{ color: "#B00020", marginBottom: 8 }}
                      >
                        {fieldState.error?.message}
                      </Text>
                    )}
                  </View>
                )}
              />
              <Controller
                control={form.control}
                name="milk"
                render={({ field, fieldState }) => (
                  <View>
                    <TextInput
                      label={"Milk (ml)"}
                      ref={field.ref}
                      value={String(field.value)}
                      onChangeText={field.onChange}
                      onBlur={field.onBlur}
                      error={fieldState.invalid}
                      className="mb-2"
                    />
                    {fieldState.invalid && (
                      <Text
                        variant="bodySmall"
                        style={{ color: "#B00020", marginBottom: 8 }}
                      >
                        {fieldState.error?.message}
                      </Text>
                    )}
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </Dialog.ScrollArea>
        <Dialog.Actions>
          <Button onPress={onClose}>Cancel</Button>
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
