'use client'

import styled from "styled-components";
import Image from "next/image";
import logo from "../public/grocery4me-icon.png";

const Nav = styled.nav`
    height: 80px;
    background: #c9c7b9;
    display: flex;
    justify-content: left;
    align-items: center;
    `;

const NavElements = styled.div`
    padding: 0rem 2rem; 
`;

const Logo = styled.a`
    display: flex;
    height: 75px;
    width: 91px;   
`;

const Navbar = () => {
  return (
    <Nav>
        <NavElements>
            <Logo href={"/"}>
                <Image
                    src={logo}
                    width={90}
                    height={45}
                    alt="Recipe4Me Logo"
                />
            </Logo>
        </NavElements>
    </Nav>
  );
}

export default Navbar