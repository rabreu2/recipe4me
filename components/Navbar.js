'use client'

import Link from "next/link";
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

const Navbar = () => {
  return (
    <Nav>
        <NavElements>
            <Link href={"/"}>
                <Image
                    src={logo}
                    width={50}
                    height={50}
                    alt="Recipe4Me Logo"
                />
            </Link>
        </NavElements>
    </Nav>
  )
}

export default Navbar