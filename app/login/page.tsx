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
import Link from "next/link";

const Hero = styled.div`
    display: grid;
    place-items: center;
    flex-grow: 1;
    color: black;
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

const Content = styled.div`
  position:absolute;
  margin-left:auto;
  margin-right:auto;
  justify-content: center;
  width:75%;
  display: grid;
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
      const res = await axios.post("/api/users/login", user);
      setIsLoggedIn(true);
      if (res.data.data) {
        const homeUrl = new URL(res.data.data);
        router.push(homeUrl.toString())
      } else {
        router.push("/");
      }
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
        style: { backgroundColor: "#22b14c", color: "#fff" },
      });
    }
  }, [searchParams]);

  return (
    <Hero>
      <Content>
        <ToastContainer />
        <div className="grid">
          <RecipeLogo>{loading ? "" : ""}<Image
            priority={true}
            src={logo}
            width={75}
            height={45}
            alt="Recipe4Me Logo"
          /></RecipeLogo>

          <form className="grid"
            onSubmit={(e) => {
              e.preventDefault(); // Prevents page reload
              onLogin(); // Your login handler
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
              Email<span className="text-red-500">*</span>
            </label>

            <input
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
              className="pl-2 pr-4 py-1 pt-4 text-gray-600 text-lg border rounded-xl focus:outline-none focus:border-gray-600 hover:bg-gray-100 transition-colors duration-300 ease-in-out"
            />
            <label className="text-sm transform -translate-y-[50px] -translate-x-[-10px]" htmlFor="password">
              Password<span className="text-red-500">*</span>
            </label>

            <Link href={`/passwordreset`} className="w-fit hover:underline text-sm mb-1 transform -translate-y-[15px]">Forgot Password?</Link>

            <button
              type="submit"
              className="py-1 mt-1 text-lg text-gray-800 bg-[#22b14c] border rounded-xl hover:bg-[#187e37] transition-colors duration-300 ease-in-out"
            >
              Log in
            </button>
          </form>
        </div>
      </Content>
    </Hero>
  )
}

const LoginPageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LoginPage />
  </Suspense>
);

export default LoginPageWithSuspense;