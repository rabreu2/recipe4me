"use client";
import styled from "styled-components";
import { useContext, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import ImageWithFallback from "@/src/helper/imageWithFallback";
import img from "@/public/cutlery-image.jpg"
import { BookmarkIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import LoginContext from "@/app/LoginContext";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";

const Hero = styled.div`
    display: grid;
    place-items: center;
    flex-grow: 1;
    color: black;
`

const RecipeBox = styled.ul`
    justify-content: center;
    align-items: center;
    display: grid;
    margin-top: 1rem;
    max-width: 1045px;
`

const RecipeName = styled.h1`
    font-weight: 600;
    line-height: 1.1;
`

const RecipeExtras = styled.div`
    display: flex;
    margin-top: 5px;
`

const Ingredients = styled.h1`
    font-weight: 600;
    line-height: 1.1;
`

const IngredientLabel = styled.label`
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    padding-top: 6px;
    @media (min-width: 768px) {
        padding-top: 4px; 
    }
    @media (min-width: 1280px) {
        padding-top: 0px;
    }
`

const Ingredient = styled.input`
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
`

const Checkmark = styled.span`
    position: absolute;
    top: 3px;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #d3d1c5;
`

const Instructions = styled.h1`
    font-weight: 600;
    line-height: 1.1;
`

const InstructionBox = styled.div`
    margin-bottom: 2rem;
`

const InstructionsList = styled.ol`
    padding-left: 20px;
    list-style: auto;
`

const Instruction = styled.li`
    margin-bottom: 10px;
`

const capitalizeTitle = (str: string): string => {
    const prepositions = new Set(["of", "and", "a", "in", "on", "at", "to", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "from", "up", "down", "over", "under", "again", "further", "then", "once"]);

    return str.replace(/\b\w+\b/g, (word, index) => {
        return index === 0 || !prepositions.has(word.toLowerCase())
            ? word.charAt(0).toUpperCase() + word.slice(1)
            : word.toLowerCase();
    });
};

interface Recipe {
    id: number;
    image: string;
    title: string;
    readyInMinutes: number;
    servings: number;
    summary: string;
    instructions: string;
    extendedIngredients: [{
        id: number;
        original: string;
    }];
    analyzedInstructions: [{
        name: string;
        steps: [{
            number: number;
            step: string;
        }];

    }]
};

function Recipe({ params }: { params: { id: string } }) {
    const id = {
        id: parseInt(params.id)
    };
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [, setUser] = useState<any>();
    const [isRecipeSaved, setIsRecipeSaved] = useState<boolean>(false);
    const { isLoggedIn } = useContext(LoginContext)!;

    useEffect(() => {
        if (!params.id) return; // Prevents unnecessary API calls

        const controller = new AbortController();

        const getUser = async () => {
            if (!isLoggedIn) return;
            try {
                const res = await axios.get('/api/users/me', { withCredentials: true });
                if (!res.data.data) {
                    throw new Error("Cannot save recipe, user not found");
                }
                if (res.data.data.savedRecipes.includes(id.id)) {
                    setIsRecipeSaved(true);
                } else {
                    setIsRecipeSaved(false);
                }

                setUser(res.data.data);

            } catch (error) {
                console.error('Error fetching saved recipes:', error);
            } finally {
                setLoading(false);
            }
        }

        const getRecipe = async () => {
            try {
                const response = await axios.post('/api/users/getrecipe', id);
                setRecipe(response.data.data);
            } catch (error: any) {
                console.error("Error fetching recipe:", error);
            } finally {
                setLoading(false);
            }
        };

        getRecipe();
        getUser();

        return () => controller.abort();
    }, [params.id]);

    const onSaveRecipe = async (recipeId: number) => {
        try {
            const res = await axios.get('/api/users/me', { withCredentials: true });

            if (!res.data.data) {
                throw new Error("Cannot save recipe, user not found");
            }
            if (res.data.data.savedRecipes.includes(recipeId)) {
                setIsRecipeSaved(false);
            } else {
                setIsRecipeSaved(true);
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

    if (!recipe) return
    <Hero>
        <div>Recipe Not Found</div>
    </Hero>;

    return (
        <Hero>
            <RecipeBox>
                <div className="relative flex items-center justify-between w-full">
                    <RecipeName className="text-lg sm:text-2xl md:text-3xl lg:text-5xl xl:mx-0 mx-6 my-8">
                        {capitalizeTitle(recipe.title.replace(/^.*\?\?/, ""))}
                    </RecipeName>
                </div>
                <hr className="h-0.5 bg-[#9c9c9c] mb-10 xl:mx-0 mx-6"></hr>
                <div className="md:flex md:items-start md:gap-5 grid place-items-center xl:mx-0 mx-6">
                    <div className="relative aspect-[128/95] w-[300px] sm:w-[400px] md:w-[300px] shrink-0 md:mb-0 mb-12">
                        <ImageWithFallback
                            src={recipe.image}
                            fallbackSrc={img}
                            alt="Recipe Image"
                            fill
                            className="object-cover rounded-lg"
                        />

                        {isLoggedIn && (
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onSaveRecipe(recipe.id);
                                }}
                                className="absolute right-0 flex items-center justify-center w-[48px] h-[48px]"
                            >
                                {isRecipeSaved ? (
                                    <BookmarkIconSolid className="w-full h-full text-[#22b14c]" />
                                ) : (
                                    <BookmarkIcon className="w-full h-full text-[#000]" />
                                )}
                            </button>
                        )}

                        <RecipeExtras className="[transform:translateY(228px)] sm:[transform:translateY(300px)] md:[transform:translateY(230px)] ml-[88px] sm:ml-[138px] md:ml-[88px]">
                            <ClockIcon className="w-4 h-5 mt-[1px]" />
                            &nbsp;{recipe.readyInMinutes} mins&nbsp;&nbsp;|&nbsp;&nbsp;
                            <UserIcon className="w-4 h-5 mt-[1px]" />
                            &nbsp;{recipe.servings}
                        </RecipeExtras>
                    </div>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: recipe.summary.replace(/(<([^>]+)>)/gi, ""),
                        }}
                        className="flex-1 min-w-0 text-xs sm:text-sm lg:text-base xl:text-lg break-words"
                    ></div>
                </div>

                <hr className="h-0.5 bg-[#9c9c9c] mt-10 xl:mx-0 mx-6"></hr>
                <Ingredients className="text-lg sm:text-2xl md:text-3xl lg:text-5xl xl:mx-0 mx-6 my-8">Ingredients</Ingredients>
                <ul className="mx-10 xl:mx-6 text-xs sm:text-sm lg:text-base xl:text-lg break-words">
                    {recipe.extendedIngredients.map((ingredient) => (
                        <IngredientLabel key={ingredient.id} className="group">{ingredient.original.replace(/^(.)/, (match) => match.toUpperCase())}
                            <Ingredient className="peer" type="checkbox" id={ingredient.id.toString()} name={ingredient.id.toString()} />
                            <Checkmark className="group-hover:bg-[#c9c7b9] peer-checked:bg-[#22b14c] transition-colors duration-300 ease-in-out"></Checkmark>
                            <svg
                                className="absolute w-4 h-4 mt-1 hidden peer-checked:block pointer-events-none top-[4px] left-[5px]"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="4"
                                stroke-linecap="round"
                                stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </IngredientLabel>
                    ))}
                </ul>
                <hr className="h-0.5 bg-[#9c9c9c] mt-10 xl:mx-0 mx-6"></hr>
                <Instructions className="text-lg sm:text-2xl md:text-3xl lg:text-5xl xl:mx-0 mx-6 my-8">Instructions</Instructions>
                <InstructionBox className="mx-10 xl:mx-6">
                    <InstructionsList>
                        {recipe.analyzedInstructions.at(0)?.steps.map((instruction) => (
                            <Instruction className="text-xs sm:text-sm lg:text-base xl:text-lg break-words" key={instruction.number}>{instruction.step.replace(/\b(Saut|saut)\b/g, "$1é").replace(/\.(\S)/g, ". $1")}</Instruction>
                        ))}
                    </InstructionsList>
                </InstructionBox>
            </RecipeBox>
        </Hero>
    )
}

export default Recipe;