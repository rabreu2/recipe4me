import { connect } from "@/src/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";

await connect();

export async function POST(request: NextRequest) {
    const API_KEY = process.env.API_KEY!;
    const API_URL = process.env.PUBLIC_API_URL!;

    try {
        const reqBody = await request.json();

        const { user } = reqBody;
        const recipeIds = user.savedRecipes;
        const ids: string = recipeIds.join(",");
        const uri = `/recipes/informationBulk?apiKey=${API_KEY}&ids=${ids}`;

        const response = await fetch(`${API_URL}${uri}`);

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        return NextResponse.json({
            message: "Recipes found",
            data: data
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 })

    }
}