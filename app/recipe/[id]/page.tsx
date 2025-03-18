"use client";
import styled from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import ImageWithFallback from "@/src/helper/imageWithFallback";
import img from "@/public/cutlery-image.jpg"
import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";

const Hero = styled.div`
    min-height: 81.6vh;
    background: #ebe8d8;
    color: #000;
    justify-content: center;
    align-items: baseline;
    display: flex;
`

const RecipeBox = styled.ul`
    justify-content: center;
    align-items: center;
    display: grid;
    margin-top: 1rem;
    max-width: 1045px;
`

const RecipeName = styled.h1`
    margin: 2rem 0;
    font-size: 3rem;
    font-weight: 600;
    line-height: 1.1;
`

const RecipeSummary = styled.div`
    font-size: 18px;
`

const RecipeExtras = styled.div`
    display: flex;
    margin-left: 88px;
    margin-top: 5px;
`

const Ingredients = styled.h1`
    margin: 2rem 0;
    font-size: 2.3rem;
    font-weight: 600;
    line-height: 1.1;
`

const IngredientsList = styled.ul`
    margin-left: 5px;
`

const IngredientLabel = styled.label`
    display: block;
    position: relative;
    padding-left: 35px;
    margin-bottom: 12px;
    cursor: pointer;
    font-size: 22px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
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
    margin: 2rem 0;
    font-size: 2.3rem;
    font-weight: 600;
    line-height: 1.1;
`

const InstructionBox = styled.div`
    margin-left: 5px;
    margin-bottom: 2rem;
`

const InstructionsList = styled.ol`
    padding-left: 20px;
    list-style: auto;
    font-size: 22px;
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
        id: params.id
    };
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return; // Prevents unnecessary API calls

        const controller = new AbortController();


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

        return () => controller.abort();
    }, [params.id]);

    console.log(recipe);

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
                <RecipeName>{capitalizeTitle(recipe.title.replace(/^.*\?\?/, ""))}</RecipeName>
                <hr className="h-0.5 bg-[#9c9c9c] mb-10"></hr>
                <div className="flex">
                    <ImageWithFallback src={recipe.image}
                        alt="Recipe Image"
                        width={300}
                        height={200}
                        fallbackSrc={img}
                    />
                    <RecipeSummary dangerouslySetInnerHTML={{ __html: recipe.summary.replace(/(<([^>]+)>)/ig, "") }} className="ml-5"></RecipeSummary>
                </div>
                <RecipeExtras>
                    <ClockIcon className="w-4 h-5 mt-[1px]" />&nbsp;{recipe.readyInMinutes} mins&nbsp;&nbsp;|&nbsp;&nbsp;<UserIcon className="w-4 h-5 mt-[1px]" />&nbsp;{recipe.servings}
                </RecipeExtras>
                <hr className="h-0.5 bg-[#9c9c9c] mt-10"></hr>
                <Ingredients>Ingredients</Ingredients>
                <IngredientsList>
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
                </IngredientsList>
                <hr className="h-0.5 bg-[#9c9c9c] mt-7"></hr>
                <Instructions>Instructions</Instructions>
                <InstructionBox>
                    <InstructionsList>
                        {recipe.analyzedInstructions.at(0)?.steps.map((instruction) => (
                            <Instruction  key={instruction.number}>{instruction.step.replace(/\b(Saut|saut)\b/g, "$1é").replace(/\.(\S)/g, ". $1")}</Instruction>
                        ))}
                    </InstructionsList>
                </InstructionBox>
            </RecipeBox>
        </Hero>
    )
}

export default Recipe;