import { useState } from "react";
import { TouchableOpacity } from "react-native";
import type { TeaIngredients } from "@/types/tea";
import { MakeTeaDialog } from "../dialogs";
import RecipeCard from "./recipe-card";

const TeaCard = ({
  name,
  description,
  ingredients,
}: {
  name: string;
  description: string;
  ingredients: TeaIngredients;
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <MakeTeaDialog
        ingredients={ingredients}
        name={name}
        onClose={() => setShowConfirm(false)}
        visible={showConfirm}
      />

      <TouchableOpacity onPress={() => setShowConfirm(true)}>
        <RecipeCard
          description={description}
          ingredients={ingredients}
          name={name}
        />
      </TouchableOpacity>
    </>
  );
};

export default TeaCard;
