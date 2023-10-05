import { useNavigate, useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { AiFillHome } from "react-icons/ai";
import axios from "axios";
import "./Recipe.scss";

function Recipe() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<FullRecipe>({
    name: "",
    category: "",
    area: "",
    imageUrl: "",
    instructions: "",
    ingredients: [],
    measures: [],
  });
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    async function fetchRecipeDetails() {
      try {
        const response = await axios.get(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`,
        );
        if (response.data.meals === null) {
          throw Error("Could not find recipe");
        }

        const recipeResponse = response.data.meals[0];
        const recipeObj: FullRecipe = {
          name: "",
          category: "",
          area: "",
          imageUrl: "",
          instructions: "",
          ingredients: [],
          measures: [],
        };
        recipeObj.name = recipeResponse.strMeal;
        recipeObj.category = recipeResponse.strCategory;
        recipeObj.area = recipeResponse.strArea;
        recipeObj.imageUrl = recipeResponse.strMealThumb;
        recipeObj.instructions = recipeResponse.strInstructions;
        for (let i = 1; i <= 20; i++) {
          if (
            recipeResponse[`strIngredient${i}`] === "" ||
            recipeResponse[`strIngredient${i}`] === null
          )
            break;

          recipeObj.ingredients.push(recipeResponse[`strIngredient${i}`]);
          recipeObj.measures.push(recipeResponse[`strMeasure${i}`]);
        }

        setRecipe(recipeObj);
        setReady(true);
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    }

    fetchRecipeDetails();
  }, [navigate, recipeId]);

  if (!ready) return <></>;
  else
    return (
      <main id="RecipeMain">
        <header>
          <Link to="/" id="backtext">
            <AiFillHome size={32} />
          </Link>
        </header>

        <section>
          <img src={recipe.imageUrl} />

          <div id="recipeText">
            <h1>
              {recipe.name}{" "}
              <span>
                ({recipe.area} {recipe.category.toLowerCase()})
              </span>
            </h1>

            <h3>Ingredients</h3>
            <ul>
              {recipe.ingredients.map((ingredient, i) => (
                <li key={ingredient}>
                  {ingredient} ({recipe.measures[i].trim()})
                </li>
              ))}
            </ul>

            <h3>Instructions</h3>
            <p>{recipe.instructions}</p>
          </div>
        </section>
      </main>
    );
}

export default Recipe;
