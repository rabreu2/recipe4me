"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import ReactPaginate from 'react-paginate';
import axios from "axios";
import { useRouter } from "next/navigation";
import img from "@/public/cutlery-image.jpg"
import ImageWithFallback from "@/src/helper/imageWithFallback";
import { ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import RecipeForm from "@/components/RecipeForm";

const Hero = styled.div`
    min-height: 88vh;
    background: #ebe8d8;
    color: #000;
    justify-content: center;
    align-items: center;
`

const ResultBox = styled.ul`
    justify-content: center;
    align-items: center;
    display: grid;
    margin-top: 30px;
    min-width: 1045px;
`

const ListBox = styled.div`
    display: flex;
    height: 15vh;
    width: 75vw;
    max-width: 1720px;
    min-width: 65rem;
    min-height: 13rem;
    background: #d3d1c5;
    margin-top: 15px;
    padding: 15px;
    border-radius: 0.5rem;
`

const RecipeName = styled.li`
    margin-left: 15px;
    margin-bottom: 2px;
    font-size: max(1.6rem, min(5vw, 1.6rem));
    font-weight: 600;
`
const RecipeExtras = styled.li`
    margin-left: 15px;
    margin-bottom: 5px;
    font-size: 0.75rem;
    display: flex;
`

const Recipes = () => {
    const router = useRouter();
    const [recipes, setRecipes] = useState<any[]>([]);
    const [recipeNumber, setRecipeNumber] = useState<any>();

    useEffect(() => {
        const returnedRecipes = localStorage.getItem("recipes");
        if (returnedRecipes) {
            setRecipes(JSON.parse(returnedRecipes).results);
            setRecipeNumber(JSON.parse(returnedRecipes).totalResults);
        }
    }, []);

    const loadRecipesFromServer = async (offset: number) => {
        try {
            const recipe = {
                query: localStorage.getItem("query") + `&offset=${offset}`
            }
            const response = await axios.post('/api/users/getrecipes', recipe);
            localStorage.removeItem("recipes");
            localStorage.setItem("recipes", JSON.stringify(response.data.data));

            setRecipes(response.data.data.results);
            setRecipeNumber(response.data.data.totalResults);
            router.push("/recipes");
        } catch (error: any) {
            console.error(error);
        }
    }

    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected) * 10;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
        );
        await loadRecipesFromServer(newOffset);
    }

    const capitalizeTitle = (str: string): string => {
        const prepositions = new Set(["of", "and", "a", "in", "on", "at", "to", "by", "for", "with", "about", "against", "between", "into", "through", "during", "before", "after", "above", "below", "from", "up", "down", "over", "under", "again", "further", "then", "once"]);

        return str.replace(/\b\w+\b/g, (word, index) => {
            return index === 0 || !prepositions.has(word.toLowerCase())
                ? word.charAt(0).toUpperCase() + word.slice(1)
                : word.toLowerCase();
        });
    };

    return (
        <Hero>
            {recipes.length === 0 ? (
                <p>No recipes available</p>
            ) : (
                <ResultBox>
                    <RecipeForm setRecipes={setRecipes} className="w-full my-[30px]" />
                    {recipes.map((recipe) => (
                        <Link className='group contents' href={`/recipe/${recipe.id}`} passHref>
                            <ListBox className='hover:bg-[#c9c7b9]' key={recipe.id}>
                                <ImageWithFallback src={recipe.image}
                                    alt="Recipe Image"
                                    width={200}
                                    height={200}
                                    fallbackSrc={img}
                                />
                                <div className="mt-3">
                                    <RecipeName className="group-hover:underline">
                                        {capitalizeTitle(recipe.title.replace(/^.*\?\?/, ""))}
                                    </RecipeName>
                                    <RecipeExtras>
                                        <ClockIcon className="w-4 h-4" />&nbsp;{recipe.readyInMinutes} mins&nbsp;&nbsp;|&nbsp;&nbsp;<UserIcon className="w-4 h-4" />&nbsp;{recipe.servings}
                                    </RecipeExtras>
                                    <div dangerouslySetInnerHTML={{ __html: recipe.summary.replace(/(<([^>]+)>)/ig, "").replace(/^(.)/, (match: string) => match.toUpperCase()) }} style={{
                                        overflow: 'hidden',
                                        marginLeft: '15px',
                                        textOverflow: 'ellipsis',
                                        fontSize: '1rem',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        lineHeight: '1.5em'
                                    }} />
                                </div>
                            </ListBox>
                        </Link>
                    ))}
                </ResultBox>
            )}
            {recipeNumber === 0 ? (
                <p />
            ) : (
                <div className="flex w-full justify-center text-center px-0 py-[45px]">
                    <ReactPaginate
                        pageCount={Math.ceil(recipeNumber / 10)}
                        pageRangeDisplayed={5}
                        className="flex"
                        pageClassName="text-black hover:bg-[#c9c7b9] mx-1 my-0 border border-black"
                        pageLinkClassName="float-left px-4 py-2"
                        breakClassName="font-bold text-black mx-1 my-0"
                        breakLinkClassName="float-left px-4 py-2"
                        previousClassName="text-black border border-black mx-1 my-0 hover:bg-[#c9c7b9]"
                        previousLinkClassName="float-left px-4 py-2"
                        nextClassName="text-black border border-black mx-1 my-0 hover:bg-[#c9c7b9]"
                        nextLinkClassName="float-left px-4 py-2"
                        activeClassName="bg-[#c9c7b9]"
                        breakLabel="..."
                        nextLabel="&raquo;"
                        previousLabel="&laquo;"
                        renderOnZeroPageCount={null}
                        onPageChange={handlePageClick}
                    />
                </div>
            )}
        </Hero>
    )
}

export default Recipes;
