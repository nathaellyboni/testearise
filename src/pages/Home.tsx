import { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import "./Home.scss";
import { Link } from "react-router-dom";

const LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

function Home() {
  const [listedRecipes, setListedRecipes] = useState<Array<Meal>>([]);
  const [ingredients, setIngredients] = useState<Array<string>>([]);
  const [ready, setReady] = useState<boolean>(false);

  // Fetch initial random recipes
  async function fetchRandomRecipes() {
    const randomMeals = [];
    const mealPromises = [];
    for (let i = 0; i < 8; i++) {
      mealPromises.push(
        axios.get("https://www.themealdb.com/api/json/v1/1/random.php"),
      );
    }
    const responses = await Promise.all(mealPromises);

    for (let i = 0; i < 8; i++) {
      const mealResponse = responses[i].data.meals[0];
      randomMeals.push({
        id: mealResponse.idMeal,
        name: mealResponse.strMeal,
        imageUrl: mealResponse.strMealThumb,
      });
    }

    setListedRecipes(randomMeals);
    setReady(true);
  }

  // Fetch all possible ingredients
  async function fetchAllIngredients() {
    const response = await axios.get(
      "https://www.themealdb.com/api/json/v1/1/list.php?i=list",
    );
    const responseIngredients = response.data.meals.map(
      (ingredient: any) => ingredient.strIngredient,
    );
    responseIngredients.sort();
    setIngredients(responseIngredients);
  }

  async function searchByName(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const name = new FormData(e.currentTarget).get("query");

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`,
    );
    setListedRecipes(
      response.data.meals.map((meal: any) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        imageUrl: meal.strMealThumb,
      })),
    );
  }

  async function searchByIngredient(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const ingredient = new FormData(e.currentTarget).get("query");

    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`,
    );
    setListedRecipes(
      response.data.meals.map((meal: any) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        imageUrl: meal.strMealThumb,
      })),
    );
  }

  async function searchByFirstLetter(letter: string) {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`,
    );
    setListedRecipes(
      response.data.meals.map((meal: any) => ({
        id: meal.idMeal,
        name: meal.strMeal,
        imageUrl: meal.strMealThumb,
      })),
    );
  }

  useEffect(() => {
    fetchRandomRecipes();
    fetchAllIngredients();
  }, []);

  if (!ready) return <></>;
  else
    return (
      <main id="HomeMain">
        <div id="header">
          <h1>Recipes</h1>

          <div id="searchBars">
            <form onSubmit={(e) => searchByName(e)}>
              <input name="query" type="text" />
              <button type="submit">SEARCH BY NAME</button>
            </form>

            <form onSubmit={(e) => searchByIngredient(e)}>
              <input name="query" type="text" list="ingredients" />
              <button type="submit">SEARCH BY INGREDIENT</button>

              <datalist id="ingredients">
                {ingredients.map((ingredient) => (
                  <option key={ingredient} value={ingredient}></option>
                ))}
              </datalist>
            </form>
          </div>

          <div id="letters">
            {LETTERS.map((letra) => (
              <span
                key={`letter-${letra}`}
                onClick={() => searchByFirstLetter(letra)}
              >
                {letra}
              </span>
            ))}
          </div>
        </div>

        <div id="mealGrid">
          {listedRecipes.map((meal) => (
            <Link
              to={`/${meal.id}`}
              key={meal.id}
              className="meal"
              target="_blank"
              rel="noreferrer noopener"
            >
              <img src={meal.imageUrl} width="200rem" height="200rem" />
              <p>{meal.name}</p>
            </Link>
          ))}
        </div>
      </main>
    );
}

export default Home;
