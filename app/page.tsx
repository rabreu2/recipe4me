'use client'
import styled from "styled-components";
import recipe4me from "../public/recipe4me-removebg.png";
import Image from "next/image";
import React, { Suspense, useEffect } from "react";
import RecipeForm from "@/components/RecipeForm";
import { useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const Hero = styled.div`
    min-height: 74vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
`;

const Content = styled.div`
    width: 100%;
    max-width: 583px;
    display: grid;
    place-items: center;
`;

const Home: React.FC = () => {

  const searchParams = useSearchParams();

  useEffect(() => {
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
          style={{ maxWidth: "100%", height: "auto" }}
        />
        <RecipeForm
          className="w-full min-w-[250px] mt-2.5"
          setPage={undefined}
          setRecipes={undefined}
          setRecipeNumber={undefined}
        />
      </Content>
    </Hero>

  );
}

const HomePageWithSuspense = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Home />
  </Suspense>
);

export default HomePageWithSuspense;
