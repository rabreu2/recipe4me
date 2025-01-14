'use client'
import styled from "styled-components";
import read from "../form-action";

const Hero = styled.div`
  height: 88vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ebe8d8;
`

const Heading = styled.h1`
  color: #000;
  font-size: 10rem;
  font-weight: 900;
`

export default function SavedRecipes() {
  
  return (
    <Hero>
      <form action={read}>
        <input type="text" placeholder="Input a dish (e.g. Meatloaf)" name="recipe" />
        <button type="submit">Submit</button>
      </form>    
    </Hero>
  );
}