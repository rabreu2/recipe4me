'use client'
import React from 'react'
import styled from 'styled-components'

const FooterStyle = styled.div`
    background: #c9c7b9;
    color: #9c9c9c;
    height: 5vh;
    min-height: 50px;
    display: flex;
    font-size: .85rem;
    justify-content: center;
    align-items: center;
`

const Footer = () => {
  return (
    <FooterStyle>
        <p>Ray Abreu ©2024</p>
    </FooterStyle>
  );
}

export default Footer