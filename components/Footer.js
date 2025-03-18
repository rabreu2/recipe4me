'use client'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import logo from "../public/github-mark.png";
import { EnvelopeIcon } from '@heroicons/react/24/solid';


const FooterStyle = styled.div`
    background: #c9c7b9;
    color: #9c9c9c;
    height: 5vh;
    min-height: 150px;
    display: flex;
    font-size: .85rem;
    justify-content: center;
    align-items: center;
`

const RayTrademark = styled.p`
  margin-top: 5px;
`

const Footer = () => {
  return (
    <FooterStyle>
      <div>
        <div className='flex'>
          <a target="_blank" rel="noopener noreferrer" href='https://github.com/rabreu2'><Image priority={true}
            src={logo}
            width={45}
            height={45}
            alt="GitHub Logo" />
          </a>
          <a target="_blank" rel="noopener noreferrer" href='mailto:rayabreu2296@gmail.com' className='ml-5'><EnvelopeIcon className='w-[45px] h-[45px] text-[#737373]'></EnvelopeIcon></a>
        </div>

        <RayTrademark>Ray Abreu ©2025</RayTrademark>
      </div>
    </FooterStyle>
  );
}

export default Footer