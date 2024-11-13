'use client'

import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/grocery4me-icon.png";

const Nav = styled.nav`
    height: 8vh;
    background: #c9c7b9;
    display: flex;
    justify-content: left;
    align-items: center;
    `;

const StyledLink = styled.a`
    padding: 0rem 1rem; 
    display: block;
`;



const Navbar = () => {
  return (
    <Nav>
        <div>
            <Link href={"/"}>
                <StyledLink>
                    <Image
                    priority={true}
                    src={logo}
                    width={90}
                    height={45}
                    alt="Recipe4Me Logo"
                    />
                </StyledLink>
            </Link>
        </div>
    </Nav>
  );
}

export default Navbar