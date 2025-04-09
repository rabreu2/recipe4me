import { connect } from "@/src/dbConfig/dbConfig";
import User from "@/src/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/src/helper/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { username, email, password } = reqBody;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPass = await bcryptjs.hash(password, 10);

        const newUser = new User({ username, email, password: hashedPass });
        const savedUser = await newUser.save();

        const response = NextResponse.json({
            message: "User created successfully",
            success: true,
        });

        sendEmail({ email, emailType: "VERIFY", userId: savedUser._id })
            .then(() => console.log("Verification email sent"))
            .catch((err) => console.error("Email error:", err));

        return response;

    } catch (error: any) {
        console.error("Signup error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}