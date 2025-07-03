'use client'
import ImageWithFallback from "@/src/helper/imageWithFallback";
import { BookmarkIcon, ClockIcon, InformationCircleIcon, UserIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import img from "@/public/cutlery-image.jpg"

const Hero = styled.div`
    min-height: 81.6vh;
    background: #ebe8d8;
    color: #000;
    justify-content: center;
    align-items: center;
`

const ResultBox = styled.ul`
    justify-content: center;
    align-items: center;
    display: grid;
    margin: 30px 0;
`

const ListBox = styled.div`
    display: flex;
    height: 15vh;
    max-width: 1720px;
    min-width: 360px;
    min-height: 13rem;
    background: #d3d1c5;
    margin-top: 15px;
    padding: 15px;
    border-radius: 0.5rem;
`

const RecipeName = styled.li`
    margin-left: 15px;
    margin-bottom: 2px;
    font-weight: 600;
`;
const RecipeExtras = styled.li`
    margin-left: 15px;
    margin-bottom: 5px;
    font-size: 0.75rem;
    display: flex;
`

const SavedRecipesTitle = styled.h1`
    font-weight: 600;
    font-size: 3rem;
`

const SaveRecipeBlurb = styled.p`
    font-size: 1.5rem;
    margin: 1rem 0;
`
const BookmarkButton = styled.button`
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get('/api/users/me', { withCredentials: true });

        if (!res.data.data) {
          throw new Error("Cannot save recipe, user not found");
        }
        setUser(res.data.data);
        if (res.data.data && Array.isArray(res.data.data.savedRecipes))
          setSavedRecipes(res.data.data.savedRecipes);
        else
          setSavedRecipes([]);

        const recipePayload = {
          user: res.data.data,
        };

        if (res.data.data.savedRecipes.length === 0)
          return;
        const response = await axios.post(`/api/users/getsavedrecipes`, recipePayload);

        setRecipes(response.data.data);

      } catch (error) {
        console.error('Error fetching saved recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const capitalizeTitle = (str: string): string => {
    const prepositions = new Set(["of", "and", "a", "in", "on", "at", "to", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "from", "up", "down", "over", "under", "again", "further", "then", "once"]);

    return str.replace(/\b\w+\b/g, (word, index) => {
      return index === 0 || !prepositions.has(word.toLowerCase())
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.toLowerCase();
    });
  };

  const onSaveRecipe = async (recipeId: number) => {
    try {
      let updatedSavedRecipes;
      let updatedRecipes;

      if (savedRecipes.includes(recipeId)) {
        updatedSavedRecipes = savedRecipes.filter(id => id !== recipeId);
        updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
      } else {
        updatedSavedRecipes = [...savedRecipes, recipeId];
        updatedRecipes = recipes;
      }

      setSavedRecipes(updatedSavedRecipes);
      setRecipes(updatedRecipes);
      const res = await axios.get('/api/users/me', { withCredentials: true });

      if (!res.data.data) {
        throw new Error("Cannot save recipe, user not found");
      }
      setUser(res.data.data);

      const recipePayload = {
        user: res.data.data,
        recipeId: recipeId,
      };
      await axios.post("/api/users/saverecipe", recipePayload);
    } catch (error: any) {
      console.log("Failed to save recipe:", error.message);
    }
  }

  if (loading) return
  <Hero>
    <div>Loading...</div>
  </Hero>;

  if (!user) return
  <Hero>
    <div>User Not Found</div>
  </Hero>;

  return (
    <Hero>
      {savedRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[81.6vh] text-center">
          <InformationCircleIcon className="w-[75px] h-[75px] text-[#22b14c]" />
          <SaveRecipeBlurb>
            You have no saved recipes.<br />Save your favorite recipes to have them show up here!
          </SaveRecipeBlurb>
        </div>
      ) : recipes.length === 0 ? (
        <p>No recipes available</p>
      ) : (
        <ResultBox>
          <SavedRecipesTitle className="my-2 lg:my-5">My Recipes</SavedRecipesTitle>
          {recipes.map((recipe) => (
            <div key={recipe.id} className="relative">
              <Link className="group contents" href={`/recipe/${recipe.id}`} passHref>
                <ListBox className="transition-colors duration-300 ease-in-out hover:bg-[#c9c7b9] xl:w-[75vw] w-[60vw]">
                  <div className="relative aspect-[128/95] xl:w-[300px] w-[185px]">
                    <ImageWithFallback
                      src={recipe.image}
                      fallbackSrc={img}
                      alt="Recipe Image"
                      fill
                      className="object-cover rounded-lg "
                    />
                    <BookmarkButton
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSaveRecipe(recipe.id);
                      }}
                    >
                      {savedRecipes.includes(recipe.id) ? (
                        <BookmarkIconSolid className="w-full h-full text-[#22b14c]" />
                      ) : (
                        <BookmarkIcon className="w-full h-full text-[#000]" />
                      )}
                    </BookmarkButton>
                  </div>
                  <div className="mt-3">
                    <div className="flow-root">
                      <div className="flex float-left relative">
                        <RecipeName className="transition-colors duration-300 ease-in-out group-hover:underline text-l lg:[font-size:max(1.6rem,min(5vw,1.6rem))]">
                          {capitalizeTitle(recipe.title.replace(/^.*\?\?/, ""))}
                        </RecipeName>
                      </div>
                    </div>
                    <RecipeExtras>
                      <ClockIcon className="w-4 h-4" />
                      &nbsp;{recipe.readyInMinutes} mins&nbsp;&nbsp;|&nbsp;&nbsp;
                      <UserIcon className="w-4 h-4" />
                      &nbsp;{recipe.servings}
                    </RecipeExtras>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: recipe.summary
                          .replace(/(<([^>]+)>)/gi, "")
                          .replace(/^(.)/, (match: string) => match.toUpperCase()),
                      }}
                      style={{
                        overflow: "hidden",
                        marginLeft: "15px",
                        textOverflow: "ellipsis",
                        fontSize: "1rem",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "1.5em",
                      }
                      }
                      className="hidden xl:[display:-webkit-box]"
                    />
                  </div>
                </ListBox>
              </Link>

            </div>
          ))}
        </ResultBox>
      )}
    </Hero>
  );
}