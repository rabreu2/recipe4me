"use client";

import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import logo from "../../public/grocery4me-icon.png";

const Hero = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    color: black;
    @media (max-width: 768px) {
      align-items: flex-start;
      padding-top: 2rem;
  }
`;

const Content = styled.div`
    width: 100%;
    max-width: 583px;
    display: grid;
    align-items: center;
    justify-content: center;
    @media (max-width: 768px) {
      place-items: start;
  }
`;

export default function ResetPasswordPage() {
    const [reset, setReset] = useState(false);
    const [user, setUser] = useState({
        password: "",
        token: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const urlToken = new URLSearchParams(window.location.search).get("token") || "";
        setUser((prev) => ({ ...prev, token: urlToken }));
    }, []);

    const resetUserPassword = async () => {
        try {
            await axios.post("/api/users/resetpassword", user);
            setReset(true);
        } catch (error: any) {
            setError("There was an error, please try again.");
            console.log(error.response.data);
        }
    };

    return (
        <Hero>
            <Content>
                <div className="mb-5 flex justify-center items-center"><Image
                    priority={true}
                    src={logo}
                    width={75}
                    height={45}
                    alt="Recipe4Me Logo"
                /></div>
                <h1 className="text-4xl mb-5 text-center">Password Reset</h1>
                {!user.token ? (
                    <h2 className="p-2 bg-[#22b14c] text-black text-center">
                        No token provided, please check your email.
                    </h2>
                ) : reset ? (
                    <div className="contents">
                        <h2 className="text-2xl">Your password has been reset! Click below to log in.</h2>
                        <a
                            href={`${process.env.NEXT_PUBLIC_DOMAIN}/login`}
                            className="inline-block justify-self-center mt-4 text-lg text-black bg-[#22b14c] border border-[#22b14c] rounded-xl text-center w-[150px] transition-colors duration-300 ease-in-out hover:bg-[#187e37] hover:border-[#187e37] p-1"
                        >
                            Log In
                        </a>
                    </div>
                ) : (
                    <form
                        className="grid"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (user.password !== confirmPassword) {
                                setError("Please enter matching passwords.");
                                return;
                            }
                            setError("");
                            resetUserPassword();
                        }}
                    >
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            required
                            className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 transition-colors duration-300 ease-in-out hover:bg-gray-100"
                        />
                        <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="password">
                            Password<span className="text-red-500">*</span>
                        </label>

                        <input
                            id="confirmpassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 transition-colors duration-300 ease-in-out hover:bg-gray-100"
                        />
                        <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="confirmpassword">
                            Confirm Password<span className="text-red-500">*</span>
                        </label>

                        <button
                            className="py-1 mt-1 text-lg text-gray-800 bg-[#22b14c] border rounded-xl transition-colors duration-300 ease-in-out hover:bg-[#187e37]"
                            type="submit"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                {error && (
                    <div>
                        <h2 className="mt-5 text-2xl text-red-500">{error}</h2>
                    </div>
                )}
            </Content>
        </Hero>
    )
}