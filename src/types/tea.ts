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
  ingredients: {
    tea: number;
    condensedMilk: number;
    evaporatedMilk: number;
    milk: number;
  };
};
