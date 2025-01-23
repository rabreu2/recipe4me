'use client'
import styled from "styled-components";
import read from "./form-action";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import recipe4me from "../public/recipe4me-removebg.png";
import Image from "next/image";


const Hero = styled.div`
  height: 88vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebe8d8;
`
const RecipeForm = styled.form`
  width: 100%;
  max-width: 583px;
  min-width: 250px;
  margin-top: 10px;
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
        <RecipeForm action={read}>
          <div className="relative">
            <input type="text" placeholder="Input a dish (e.g. Meatloaf)"  className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring focus:border-gray-900" name="recipe" />
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <button type="submit">Submit</button>
        </RecipeForm>    
      </Content>
    </Hero>
  );
}