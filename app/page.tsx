'use client'
import styled from "styled-components";
import recipe4me from "../public/recipe4me-removebg.png";
import Image from "next/image";
import React from "react";
import RecipeForm from "@/components/RecipeForm";


const Hero = styled.div`
  min-height: 81.6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebe8d8;
`

const Content = styled.div`
  position:absolute;
  margin-left:auto;
  margin-right:auto;
`

export default function Home() {

  return (
    <Hero>
      <Content>
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
