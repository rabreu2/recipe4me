"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

const Hero = styled.div`
    height: 88vh;
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
    padding: 45px 0;
`

const ListBox = styled.div`
    height: 15vh;
    width: 75rem;
    background: #c9c7b9;
    margin-top: 15px;
`

const Recipes = () => {
    const [recipes, setRecipes] = useState<any[]>([]);
    

    useEffect(() => {
        const returnedRecipes = localStorage.getItem("recipes");
        if (returnedRecipes) {
            setRecipes(JSON.parse(returnedRecipes));
          }
    }, []);

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
        </Hero>
    )
}

export default Recipes;