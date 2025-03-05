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

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext)!;

  const onLogin = async () => {
    try {
      if (isLoggedIn) {
        router.push("/");
      }
      setLoading(true);
      await axios.post("/api/users/login", user);
      setIsLoggedIn(true);
      router.push("/");
    } catch (error: any) {
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
      <div className="grid">
        <RecipeLogo>{loading ? "Processing" : ""}<Image
          priority={true}
          src={logo}
          width={75}
          height={45}
          alt="Recipe4Me Logo"
        /></RecipeLogo>

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

        <button className="py-1 mt-1 text-lg text-gray-800 bg-[#22b14c] border rounded-xl hover:bg-[#187e37]" onClick={onLogin}>Log in</button>
      </div>
    </Hero>
  )
}

const LoginPageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LoginPage />
  </Suspense>
);

export default LoginPageWithSuspense;