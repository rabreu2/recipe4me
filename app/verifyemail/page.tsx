"use client";

import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import styled from "styled-components";
import Image from "next/image";
import logo from "../../public/grocery4me-icon.png";

const Hero = styled.div`
  min-height: 81.6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebe8d8;
  color: #000;
`

export default function VerifyEmailPage() {
    const [token, setToken] = useState("");
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const urlToken = window.location.search.split("=")[1];
        setToken(urlToken || "");
    }, []);
    useEffect(() => {
        const verifyUserEmail = async () => {
            try {
                await axios.post("/api/users/verifyemail", { token });
                setVerified(true);
            } catch (error: any) {
                setError(true);
                console.log(error.response.data);
            }
        };
        if (token.length > 0) {
            verifyUserEmail();
        }
    }, [token]);

    return (
        <Hero className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="mb-5"><Image
                priority={true}
                src={logo}
                width={75}
                height={45}
                alt="Recipe4Me Logo"
            /></div>
            <h1 className="text-4xl mb-5">Email Verification</h1>
            {token ? `` : <h2 className="p-2 bg-[#22b14c] text-black">
                No token provided, please check your email.
            </h2>}


            {verified && (
                <div className="contents">
                    <h2 className="text-2xl">Your email has been verified! Click below to log in.</h2>
                    <a href={`${process.env.NEXT_PUBLIC_DOMAIN}/login`}
                        style={{
                            display: 'inline-block',
                            padding: '4px 0',
                            marginTop: '4px',
                            fontSize: '1.125rem',
                            color: '#000',
                            backgroundColor: '#22b14c',
                            border: '1px solid #22b14c',
                            borderRadius: '12px',
                            textDecoration: 'none',
                            textAlign: 'center',
                            width: '150px',
                            transition: 'background-color 0.3s ease-in-out, border-color 0.3s ease-in-out',
                            margin: '20px',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#187e37';
                            e.currentTarget.style.borderColor = '#187e37';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#22b14c';
                            e.currentTarget.style.borderColor = '#22b14c';
                        }}>
                        Log In
                    </a>
                </div>
            )}

            {error && (
                <div>
                    <h2 className="text-2xl text-red-500">There was an error, please try again.</h2>
                </div>
            )}
        </Hero>
    )
}