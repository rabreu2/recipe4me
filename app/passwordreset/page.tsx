"use client";
import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import axios from "axios";
import logo from "../../public/grocery4me-icon.png";
import { CheckCircleIcon } from "@heroicons/react/24/outline";


const Hero = styled.div`
  min-height: 81.6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebe8d8;
  color: #000;
`

const RecipeLogo = styled.h1`
    margin: 1rem 0;
    font-size: 2.3rem;
    font-weight: 600;
    line-height: 1.1;
    align-items: center;
    display: flex;
    justify-content: center;
`

const ResetBlurb = styled.p`
    font-size: 1.5rem;
    margin: 1rem 0;
`

const PasswordReset: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({
        email: "",
    });
    const [emailSent, setEmailSent] = useState(false);


    const onPasswordReset = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/passwordreset", user);
            if (response.status === 200) {
                setEmailSent(true);
            }
        } catch (error: any) {
            console.log("Login failed", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Hero>
            <div className="grid">
                {!emailSent ? (
                    <div>
                        <RecipeLogo>{loading ? "" : ""}<Image
                            priority={true}
                            src={logo}
                            width={75}
                            height={45}
                            alt="Recipe4Me Logo"
                        /></RecipeLogo>
                        <ResetBlurb>Please enter your email below to reset your password.</ResetBlurb>
                        <form className="grid justify-center"
                            onSubmit={(e) => {
                                e.preventDefault(); // Prevents page reload
                                onPasswordReset();
                            }}
                        >
                            <input
                                id="email"
                                type="text"
                                value={user.email}
                                onChange={(e) => setUser({ ...user, email: e.target.value })}
                                required
                                className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 hover:bg-gray-100 transition-colors duration-300 ease-in-out"
                            />
                            <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="email">
                                Email
                            </label>

                            <button
                                type="submit"
                                className="py-1 mt-1 text-lg text-gray-800 bg-[#22b14c] border rounded-xl hover:bg-[#187e37] transition-colors duration-300 ease-in-out"
                            >
                                Reset Password
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div className="flex justify-center">
                            <CheckCircleIcon className="w-[75px] h-[75px] text-[#22b14c]"></CheckCircleIcon>
                        </div>
                        <ResetBlurb>
                            A password reset link has been sent to the entered email address.
                        </ResetBlurb>
                    </div>
                )}
            </div>
        </Hero>
    )
}

export default PasswordReset;