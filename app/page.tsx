'use client'
import styled from "styled-components";
import recipe4me from "../public/recipe4me-removebg.png";
import Image from "next/image";
import React, { useEffect } from "react";
import RecipeForm from "@/components/RecipeForm";
import { useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const Hero = styled.div`
    display: grid;
    place-items: center;
    flex-grow: 1;
`

const Content = styled.div`
  position:absolute;
  margin-left:auto;
  margin-right:auto;
  width:75%;
  justify-content: center;
  display: grid;
`

export default function Home() {

  const searchParams = useSearchParams();

  useEffect(() => {
    // Check for the message in the query parameters

    const message = searchParams?.get('message');

    if (message) {
      toast.info(message as string, {
        position: 'top-right',
        autoClose: 5000,
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
        <Image
          priority={true}
          src={recipe4me}
          alt="Recipe4Me"
        />
        <RecipeForm className="w-full max-w-[583px] min-w-[250px] mt-2.5" setPage={undefined} setRecipes={undefined} setRecipeNumber={undefined} />
      </Content>
    </Hero>
  );
}
