import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.tsx";
import Recipe from "./pages/Recipe.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:recipeId" element={<Recipe />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
