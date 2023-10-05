/// <reference types="vite/client" />

interface Meal {
  id: string;
  name: string;
  imageUrl: string;
}

interface FullRecipe {
  name: string;
  category: string;
  area: string;
  imageUrl: string;
  instructions: string;
  ingredients: Array<string>;
  measures: Array<string>;
}
