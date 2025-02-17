"use client";
import styled from "styled-components";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

const Hero = styled.div`
    min-height: 88vh;
    background: #ebe8d8;
    color: #000;
    justify-content: center;
    align-items: center;
`

interface Recipe {
    id: number;
    image: string;
    title: string;
    readyInMinutes: number;
    servings: number;
    summary: string;
    instructions: string;
}

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

    if (loading) return <div>Loading...</div>;

    if (!recipe) return <div>Recipe Not Found</div>;

    return (
        <Hero>
            <h1>{recipe.title}</h1>
            <p>{recipe.summary}</p>
        </Hero>
    )
}

export default Recipe;