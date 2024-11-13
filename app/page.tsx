'use client'
import styled from "styled-components";

const Hero = styled.div`
  height: 90vh;
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

export default function Home() {
  return (
    <Hero>
      <Heading>Home</Heading>
    </Hero>
  )
}