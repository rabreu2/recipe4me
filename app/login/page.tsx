"use client";
import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation"
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "../LoginContext";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useSearchParams } from "next/navigation";
import styled from "styled-components";

const Hero = styled.div`
  min-height: 88vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebe8d8;
  color: #000;
`

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

    const searchParams = useSearchParams();

    useEffect(() => {
        // Check for the message in the query parameters

        const message = searchParams?.get('message');
    
        if (message) {
          toast.info(message as string, {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: 'colored',
          });
        }
      }, [searchParams]);

    return (
        <Hero>
            <ToastContainer />
            <h1>{loading ? "Processing" : "Login"}</h1>
            
            <label htmlFor="email">Email</label>
            <input 
                id="email"
                type="text"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value})}
                placeholder="email"
                />
            <label htmlFor="password">Password</label>
            <input 
                id="password"
                type="password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value})}
                placeholder="password"
                />
            <button onClick={onLogin}>Login</button>
        </Hero>
    )
}

const LoginPageWithSuspense = () => (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );

export default LoginPageWithSuspense;