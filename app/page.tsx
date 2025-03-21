'use client'
import styled from "styled-components";
import recipe4me from "../public/recipe4me-removebg.png";
import Image from "next/image";
import React from "react";
import RecipeForm from "@/components/RecipeForm";


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
