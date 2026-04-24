import { TeaIngredients } from "@/types/tea";
import { useState } from "react";
import { TouchableOpacity } from "react-native";
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
        visible={showConfirm}
        onClose={() => setShowConfirm(false)}
        name={name}
        ingredients={ingredients}
      />

      <TouchableOpacity onPress={() => setShowConfirm(true)}>
        <RecipeCard
          name={name}
          description={description}
          ingredients={ingredients}
        />
      </TouchableOpacity>
    </>
  );
};

export default TeaCard;
