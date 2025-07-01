"use client";

import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import ReactPaginate from 'react-paginate';
import axios from "axios";
import { useRouter } from "next/navigation";
import img from "@/public/cutlery-image.jpg"
import ImageWithFallback from "@/src/helper/imageWithFallback";
import { BookmarkIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkIconSolid } from "@heroicons/react/24/solid";
import Link from "next/link";
import RecipeForm from "@/components/RecipeForm";
import { LoginContext } from "@/app/LoginContext";

const Hero = styled.div`
    display: grid;
    place-items: center;
    flex-grow: 1;
    color: black;
`;

const ResultBox = styled.ul`
    justify-content: center;
    align-items: center;
    display: grid;
    margin-top: 30px;
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
`;

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

const Recipes = () => {
    const router = useRouter();
    const [recipes, setRecipes] = useState<any[]>([]);
    const [recipeNumber, setRecipeNumber] = useState<any>();
    const [page, setPage] = useState(1)
    const [user, setUser] = useState<any>();
    const [savedRecipes, setSavedRecipes] = useState<any[]>([]);
    const { isLoggedIn } = useContext(LoginContext)!;


    useEffect(() => {
        const returnedRecipes = localStorage.getItem("recipes");
        if (returnedRecipes) {
            setRecipes(JSON.parse(returnedRecipes).results);
            setRecipeNumber(JSON.parse(returnedRecipes).totalResults);
        }

        const fetchSavedRecipes = async () => {
            try {
                const res = await axios.get('/api/users/me', { withCredentials: true });
                if (!res.data.data) {
                    throw new Error("Cannot fetch saved recipes, user not found");
                }
                setUser(res.data.data);
                setSavedRecipes(res.data.data.savedRecipes); // Convert array to Set for fast lookup
            } catch (error) {
                console.error('Error fetching saved recipes:', error);
            }
        };
        if (isLoggedIn)
            fetchSavedRecipes();
    }, []);

    const loadRecipesFromServer = async (offset: number) => {
        try {
            const recipe = {
                query: localStorage.getItem("query") + `&offset=${offset}`
            }
            const response = await axios.post('/api/users/getrecipes', recipe);

            setRecipes(response.data.data.results);
            setRecipeNumber(response.data.data.totalResults);

            localStorage.removeItem("recipes");
            localStorage.setItem("recipes", JSON.stringify(response.data.data));

            router.push("/recipes");
        } catch (error: any) {
            console.error(error);
        }
    }

    const handlePageClick = async (event: any) => {
        const newOffset = (event.selected) * 10;
        const newPage = event.selected + 1;

        setPage(newPage);
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

    const onSaveRecipe = async (recipeId: number) => {
        try {
            let updatedSavedRecipes;

            if (savedRecipes.includes(recipeId)) {
                updatedSavedRecipes = savedRecipes.filter(id => id !== recipeId);
            } else {
                updatedSavedRecipes = [...savedRecipes, recipeId];
            }

            setSavedRecipes(updatedSavedRecipes);

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

    return (
        <Hero>
            {recipes.length === 0 ? (
                <p>No recipes available</p>
            ) : (
                <ResultBox>
                    <RecipeForm setPage={setPage} setRecipeNumber={setRecipeNumber} setRecipes={setRecipes} className="w-full my-[30px]" />
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
                                        {isLoggedIn && user && (
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
                                                    <BookmarkIcon className="w-full h-full text-[#000] hover:text-[#22b14c]" />
                                                )}
                                            </BookmarkButton>
                                        )}
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
            {recipeNumber === 0 ? (
                <p />
            ) : (
                <div className="flex w-full justify-center text-center px-0 py-[45px]">
                    <ReactPaginate
                        pageCount={Math.ceil(recipeNumber / 10)}
                        pageRangeDisplayed={5}
                        className="flex"
                        pageClassName="hidden lg:list-item text-black transition-colors duration-300 ease-in-out hover:bg-[#c9c7b9] mx-1 my-0 border border-black"
                        pageLinkClassName="float-left px-4 py-2"
                        breakClassName="hidden lg:list-item font-bold text-black mx-1 my-0"
                        breakLinkClassName="float-left px-4 py-2"
                        previousClassName="text-black border border-black lg:mx-1 mx-16 my-0 transition-colors duration-300 ease-in-out hover:bg-[#c9c7b9]"
                        previousLinkClassName="float-left px-4 py-2"
                        nextClassName="text-black border border-black lg:mx-1 mx-16 my-0 transition-colors duration-300 ease-in-out hover:bg-[#c9c7b9]"
                        nextLinkClassName="float-left px-4 py-2"
                        activeClassName="bg-[#c9c7b9]"
                        breakLabel="..."
                        nextLabel="&raquo;"
                        previousLabel="&laquo;"
                        renderOnZeroPageCount={null}
                        onPageChange={handlePageClick}
                        forcePage={page - 1}
                    />
                </div>
            )}
        </Hero>
    )
}

export default Recipes;
