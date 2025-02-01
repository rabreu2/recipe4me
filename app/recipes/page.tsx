"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";
import ReactPaginate from 'react-paginate';
import axios from "axios";
import { useRouter } from "next/navigation";

const Hero = styled.div`
    min-height: 88vh;
    background: #ebe8d8;
    color: #000;
    justify-content: center;
    align-items: center;
    overflow: auto;
`

const ResultBox = styled.ul`
    justify-content: center;
    align-items: center;
    display: grid;
    margin-top: 45px;
`

const ListBox = styled.div`
    height: 15vh;
    width: 75vw;
    min-width: 50rem;
    background: #d3d1c5;
    margin-top: 15px;
    border-radius: 0.5rem;
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

    const loadRecipesFromServer = async (offset:number) => {
        try {
            const recipe = {
                query: localStorage.getItem("query") + `&offset=${offset}`
            }
            const response = await axios.post('/api/users/getrecipes', recipe);
            localStorage.removeItem("recipes");
            localStorage.setItem("recipes", JSON.stringify(response.data.data));

            setRecipes(response.data.data.results);
            router.push("/recipes");
        } catch (error:any) {
            console.error(error);    
        } 
    }

    const handlePageClick = async (event:any) => {
        const newOffset = (event.selected) * 10;
        console.log(
            `User requested page number ${event.selected}, which is offset ${newOffset}`
          );
        await loadRecipesFromServer(newOffset);
    }

    return (
        <Hero>
            {recipes.length === 0 ? (
                <p>No recipes available</p>
            ) : (
                    <ResultBox>
                        {recipes.map((recipe) => (
                            <ListBox>
                                <li key={recipe.id}>{recipe.title}</li>
                            </ListBox>
                        ))}
                    </ResultBox>
            )}
            {recipeNumber === 0 ? (
                <p/>
            ) : (
                <div className="flex w-full justify-center text-center px-0 py-[45px]">
                    <ReactPaginate 
                        pageCount={Math.ceil(recipeNumber/10)}
                        pageRangeDisplayed={5}
                        className="flex"
                        pageClassName="text-black hover:bg-stone-300 mx-1 my-0 border border-black"
                        pageLinkClassName="float-left px-4 py-2"
                        breakClassName="font-bold text-black mx-1 my-0"
                        breakLinkClassName="float-left px-4 py-2"
                        previousClassName="text-black border border-black mx-1 my-0 hover:bg-stone-300"
                        previousLinkClassName="float-left px-4 py-2"
                        nextClassName="text-black border border-black mx-1 my-0 hover:bg-stone-300"
                        nextLinkClassName="float-left px-4 py-2"
                        activeClassName="bg-stone-300"
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
