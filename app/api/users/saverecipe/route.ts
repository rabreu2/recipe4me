import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { user, recipeId } = reqBody;

        const userObj = await User.findById(user._id);

        if (userObj.savedRecipes.includes(recipeId)) {
            userObj.savedRecipes = userObj.savedRecipes.filter((id: any) => id != recipeId);
            await userObj.save();

            return NextResponse.json({
                message: "Recipe unsaved successfully",
                success: true,
                data: userObj
            });
        } else {
            userObj.savedRecipes.push(recipeId);
            await userObj.save();

            return NextResponse.json({
                message: "Recipe saved successfully",
                success: true,
                data: userObj
            });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message },
            { status: 500 })
    }
}