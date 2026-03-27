export type TeaIngredients = {
  tea: number;
  condensedMilk: number;
  evaporatedMilk: number;
  milk: number;
};

export type Tea = {
  id: number;
  name: {
    en: string;
    my: string;
  };
  description: {
    en: string;
    my: string;
  };
  ingredients: TeaIngredients;
};
