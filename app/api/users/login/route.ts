import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

await connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { email, password } = reqBody;
        const user = await User.findOne({ email });
        let homeUrl = undefined;

        if (!user)
            return NextResponse.json({ error: "User does not exist" }, { status: 400 });

        if (!user.isVerified || user.isVerified === false) {
            homeUrl = new URL('/', request.nextUrl);
            homeUrl.searchParams.set('message', 'Please check your email for email verification');
        }


        const validPass = await bcryptjs.compare(password, user.password);

        if (!validPass)
            return NextResponse.json({ error: "Invlid password" }, { status: 400 });

        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        };
        const token = await jwt.sign(tokenData, process.env.AUTH_SECRET!, { expiresIn: "1d" });
        const response = NextResponse.json({
            message: "Login successful",
            success: true,
            data: homeUrl ? homeUrl.toString() : null,  // Send homeUrl as a string or null if it's not set
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24, // 1 day
        });

        return response;
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}