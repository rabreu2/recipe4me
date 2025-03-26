"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styled from "styled-components";
import logo from "../../public/grocery4me-icon.png";
import Image from "next/image";

const Hero = styled.div`
    display: grid;
    place-items: center;
    flex-grow: 1;
    color: black;
`

const Content = styled.div`
  position:absolute;
  margin-left:auto;
  margin-right:auto;
  width:75%;
  justify-content: center;
  display: grid;
`

const RecipeLogo = styled.h1`
    margin: 2rem 0;
    font-size: 2.3rem;
    font-weight: 600;
    line-height: 1.1;
    align-items: center;
    display: flex;
    justify-content: center;
`

export default function SignupPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: "",
        username: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        username: "",
        password: "",
        server: "",
    });
    const [showTooltip, setShowTooltip] = useState(false);
    const [passwordValid, setPasswordValid] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        symbol: false,
    });
    const validateEmail = (email: string) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(email);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUser((prev) => ({ ...prev, password: value }));

        setPasswordValid({
            length: value.length >= 8,
            uppercase: /[A-Z]/.test(value),
            lowercase: /[a-z]/.test(value),
            number: /\d/.test(value),
            symbol: /[@#!$%^&*()]/.test(value),
        });
    };

    const onSignup = async () => {
        if (!user.username || !user.email || !user.password) {
            setErrors({
                ...errors,
                username: !user.username ? "Username is required" : "",
                email: !user.email ? "Email is required" : errors.email,
                password: !user.password ? "Password is required" : "",
            });
            return;
        }

        if (errors.email) return; // Stop signup if email is invalid

        try {
            await axios.post("/api/users/signup", user);
            router.push("/login");
        } catch (error: any) {
            console.log("Signup failed", error.message);
            setErrors((prev) => ({
                ...prev,
                server: "Signup failed. Please try again.",
            }));
        }
    };

    return (
        <Hero>
            <Content>
                <div className="grid">
                    <RecipeLogo>
                        <Image priority={true} src={logo} width={75} height={45} alt="Recipe4Me Logo" />
                    </RecipeLogo>
                    <form
                        className="grid"
                        onSubmit={(e) => {
                            e.preventDefault();
                            onSignup();
                        }}
                    >
                        {errors.username && <p className="text-red-500">{errors.username}</p>}
                        <input
                            id="username"
                            type="text"
                            value={user.username}
                            onChange={handleChange}
                            required
                            className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 transition-colors duration-300 ease-in-out hover:bg-gray-100"
                        />
                        <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="username">
                            Username<span className="text-red-500">*</span>
                        </label>

                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                        <input
                            id="email"
                            type="text"
                            value={user.email}
                            onChange={handleChange}
                            onBlur={() => {
                                if (!validateEmail(user.email)) {
                                    setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
                                }
                            }}
                            required
                            className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 transition-colors duration-300 ease-in-out hover:bg-gray-100"
                        />
                        <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="email">
                            Email<span className="text-red-500">*</span>
                        </label>

                        {errors.password && <span className="text-red-500">{errors.password}</span>}
                        <input
                            id="password"
                            type="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                            className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 transition-colors duration-300 ease-in-out hover:bg-gray-100 w-full"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                        />
                        <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="password">
                            Password<span className="text-red-500">*</span>
                        </label>

                        {/* Tooltip Box on Hover */}
                        {showTooltip && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white shadow-md border p-2 rounded-md text-sm z-10 text-gray-500">
                                Passwords must contain:
                                <ul className="list-disc -translate-x-[-15px]">
                                    <li className={`${passwordValid.length ? "text-green-600" : "text-gray-500"}`}>
                                        At least 8 characters
                                    </li>
                                    <li className={`${passwordValid.uppercase ? "text-green-600" : "text-gray-500"}`}>
                                        One uppercase letter
                                    </li>
                                    <li className={`${passwordValid.lowercase ? "text-green-600" : "text-gray-500"}`}>
                                        One lowercase letter
                                    </li>
                                    <li className={`${passwordValid.number ? "text-green-600" : "text-gray-500"}`}>
                                        One number
                                    </li>
                                    <li className={`${passwordValid.symbol ? "text-green-600" : "text-gray-500"}`}>
                                        One special character (@ # ! $ % ^ & * ( ))
                                    </li>
                                </ul>

                            </div>
                        )}


                        {errors.server && <p className="text-red-500">{errors.server}</p>}
                        <button
                            className="py-1 mt-1 text-lg text-gray-800 bg-[#22b14c] border rounded-xl transition-colors duration-300 ease-in-out hover:bg-[#187e37]"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </form>
                </div>
            </Content>
        </Hero>
    );
}