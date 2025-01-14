"use client";

import React, { createContext, ReactNode, useEffect, useState } from "react";

interface LoginContextType {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
  }
  
export const LoginContext = createContext<LoginContextType | undefined>(undefined);

// Define the props for the AuthProvider component
interface AuthProviderProps {
    children: ReactNode;
  }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const savedLoginState = typeof window !== "undefined" ? localStorage.getItem("isLoggedIn") === "true": false; // Convert the string to boolean
    const [isLoggedIn, setIsLoggedIn] = useState(savedLoginState);

    //  // Load login state from localStorage on mount
    // useEffect(() => {
    //     const savedLoginState = localStorage.getItem("isLoggedIn");
    //     if (savedLoginState) {
    //         setIsLoggedIn(JSON.parse(savedLoginState));
    //     }
    // }, []);

     // Save login state to localStorage whenever it changes
    useEffect(() => {
            localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
    }, [isLoggedIn]);

    return (
            <LoginContext.Provider value={{ isLoggedIn: isLoggedIn, setIsLoggedIn: setIsLoggedIn}}>
                {children}
            </LoginContext.Provider>
    )
}

export default LoginContext;