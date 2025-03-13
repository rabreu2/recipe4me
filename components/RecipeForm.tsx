'use client'

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";

interface SearchFormProps {
    setRecipes?: (recipes: { name: string }[]) => void;
    setRecipeNumber?: (number: number) => void;
    setPage?: (number: number) => void;
    className?: string;
}

export default function RecipeForm({ setRecipes, setRecipeNumber, setPage, className }: SearchFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [recipe, setRecipe] = useState({
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

            if (!response.data.data || response.data.data.results.length === 0) throw new Error("No results found");

            if (setRecipes) {
                setRecipes(response.data.data.results);
            }

            if (setRecipeNumber) {
                setRecipeNumber(response.data.data.totalResults);
            }

            if (setPage) {
                setPage(1);
            }

            localStorage.setItem("recipes", JSON.stringify(response.data.data));
            localStorage.setItem("query", recipe.query);
            router.push("/recipes");
        } catch (error: any) {
            setError("Failed to fetch recipes. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className={className} onSubmit={getRecipes}>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Search for a recipe (e.g. Meatloaf)"
                    className="w-full pl-10 pr-4 py-2 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600  transition-colors duration-300 ease-in-out hover:bg-gray-100"
                    value={recipe.query}
                    onChange={(e) => setRecipe({ ...recipe, query: e.target.value })}
                    id="recipe" />
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button className="hidden" type="submit" disabled={loading}>{loading ? "Loading..." : "Fetch Recipes"}</button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
    )
}