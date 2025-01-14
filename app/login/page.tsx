"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation"
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../LoginContext";

const LoginPage: React.FC = () => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [user, setUser] = React.useState({
        email: "",
        password : "",
    });
    const {isLoggedIn, setIsLoggedIn} =  useContext(LoginContext)!;

    const onLogin = async () => {
        try {
            if (isLoggedIn) {
                router.push("/");
            }
            setLoading(true);
            await axios.post("/api/users/login", user);
            setIsLoggedIn(true);
            router.push("/");
        } catch (error:any) {
            console.log("Login failed", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>{loading ? "Processing" : "Login"}</h1>
        <hr />
        
        <label htmlFor="email">email</label>
        <input 
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({...user, email: e.target.value})}
            placeholder="email"
            />
        <label htmlFor="password">password</label>
        <input 
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({...user, password: e.target.value})}
            placeholder="password"
            />
            <button
            onClick={onLogin}>Login</button>
            <Link href="/signup">Visit signup page</Link>
        </div>
    )
}

export default LoginPage;