'use client'
import styled from "styled-components";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import recipe4me from "../public/recipe4me-removebg.png";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";


const Hero = styled.div`
  height: 88vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebe8d8;
`
const RecipeForm = styled.form`
  width: 100%;
  max-width: 583px;
  min-width: 250px;
  margin-top: 10px;
`

const Content = styled.div`
  position:absolute;
  margin-left:auto;
  margin-right:auto;
`

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [recipe, setRecipe] = React.useState({
        query: ""
  });

  const getRecipes = async (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    try {
      if (!recipe.query || recipe.query.trim() === "") {
        alert("Please search for a valid recipe");
        return false;
      }

      const response = await axios.post('/api/users/getrecipes', recipe);

      console.log("response: " + JSON.stringify(response.data.data.results.length));


      if (!response.data.data || response.data.data.results.length === 0) throw new Error("No results found");

      localStorage.setItem("recipes", JSON.stringify(response.data.data.results));
      router.push("/recipes");
    } catch (error:any) {
        setError("Failed to fetch recipes. Please try again.");
        console.error(error);    
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <Hero>
      <Content>
        <Image
          priority={true}
          src={recipe4me}
          alt="Recipe4Me"
          />
        <RecipeForm onSubmit={getRecipes}>
          <div className="relative">
            <input 
              type="text"
              placeholder="Search for a recipe (e.g. Meatloaf)" 
              className="w-full pl-10 pr-4 py-2 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 hover:bg-gray-100"
              value={recipe.query}
              onChange={(e) => setRecipe({...recipe, query: e.target.value})}
              id="recipe" />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button className="hidden" type="submit" disabled={loading}>{loading ? "Loading..." : "Fetch Posts"}</button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </RecipeForm>
      </Content>
    </Hero>
  );
}
