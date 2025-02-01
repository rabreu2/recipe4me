import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const API_KEY = process.env.API_KEY!;
    const API_URL = process.env.PUBLIC_API_URL!;

    try {
        const reqBody = await request.json();
        const {query} = reqBody;
        const queryParam = `?apiKey=${API_KEY}&query=${query}&number=10&instructionsRequired=true`;
        
        const response = await fetch(`${API_URL}${queryParam}`);

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        return NextResponse.json({
            message: "Recipes found",
            data: data
        })
    } catch (error:any) {
                return NextResponse.json({error: error.message}, {status: 500});
    }
}