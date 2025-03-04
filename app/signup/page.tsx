"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import styled from "styled-components";
import logo from "../../public/grocery4me-icon.png";
import Image from "next/image";

const Hero = styled.div`
  min-height: 88vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebe8d8;
  color: #000;
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
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })

    const onSignup = async () => {
        try {
            await axios.post("/api/users/signup", user);
            router.push("/login");
        } catch (error: any) {
            console.log("Signup failed ", error.message);
        }
    }

    return (
        <Hero>
            <div className="grid">
                <RecipeLogo><Image
                    priority={true}
                    src={logo}
                    width={75}
                    height={45}
                    alt="Recipe4Me Logo"
                /></RecipeLogo>

                <input
                    id="username"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    required
                    className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 hover:bg-gray-100"
                />
                <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="username">Username<span className="text-red-500">*</span></label>

                <input
                    id="email"
                    type="text"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    required
                    className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 hover:bg-gray-100"
                />
                <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="email">Email<span className="text-red-500">*</span></label>

                <input
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    required
                    className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 hover:bg-gray-100"
                />
                <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="password">Password<span className="text-red-500">*</span></label>
                
                <button className="py-1 mt-1 text-lg text-gray-800 bg-[#22b14c] border rounded-xl hover:bg-[#187e37]" onClick={onSignup}>Sign Up</button>
            </div>
        </Hero>
    )
}