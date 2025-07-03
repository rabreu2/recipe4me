'use client'
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/grocery4me-icon.png";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "@/app/LoginContext";

const Nav = styled.nav`
    height: 7vh;
    min-height: 70px;
    background: #c9c7b9;
    position:sticky;
    top: 0;
    z-index: 10;
    `;

const NavbarLogo = styled.div`
    padding: 0rem 0.5rem; 
    display: block;
    color: #000;
`;

const SignupLink = styled.p`
    padding: 0.25rem 0.75rem; 
    display: flex;
    float: right;
    position: relative;
    color: #000;
    border: 2px solid ${({ color }) => color || "#9c9c9c"};
    border-radius: 20px;
    background-color: #9c9c9c;
    transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
    &:hover {
        background-color: #737373;
        border-color: #737373;
    }
`;

const LoginLink = styled.p`
    padding: 0.25rem 0.75rem;
    margin-right: 0.5rem;
    display: flex;
    float: left;
    position: relative;
    color: #000;
    border: 2px solid ${({ color }) => color || "#9c9c9c"};
    border-radius: 20px;
    transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
    &:hover {
        background-color: #9c9c9c;
    }
`;

const NavLeft = styled.div`
    display: flex;
    float: left;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    padding-left: 0.5rem;
`;

const NavRight = styled.div`
    display: flex;
    float: right;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    padding-right: 1rem;
`;

const SignoutLink = styled.button`
    padding: 0.25rem 0.75rem; 
    display: flex;
    float: right;
    position: relative;
    color: #000;
    border: 2px solid ${({ color }) => color || "#9c9c9c"};
    border-radius: 20px;
    background-color: #9c9c9c;
    transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
    &:hover {
        background-color: #737373;
        border-color: #737373;
    }
    
`;

const MyRecipes = styled.p`
    padding: 0.25rem 0.75rem; 
    margin-right: 0.5rem;
    display: flex;
    float: left;
    position: relative;
    color: #000;
    border: 2px solid ${({ color }) => color || "#9c9c9c"};
    border-radius: 20px;
    transition: background-color 0.3s ease-in-out, border-color 0.3s ease-in-out;
    &:hover {
        background-color: #9c9c9c;
    }
`;

const Navbar = () => {
    const router = useRouter();
    const { isLoggedIn, setIsLoggedIn } = useContext(LoginContext);

    const logout = async () => {
        try {
            await axios.get('/api/users/logout');
            setIsLoggedIn(false);
            router.push('/')
        } catch (error) {
            console.log(error.message)
        }
    };
    return (
        <Nav>
            <NavLeft>
                <Link href="/" passHref>
                    <NavbarLogo>
                        <Image
                            priority={true}
                            src={logo}
                            width={75}
                            height={45}
                            alt="Recipe4Me Logo"
                        />
                    </NavbarLogo>
                </Link>
            </NavLeft>
            <NavRight>
                {!isLoggedIn ? (
                    <div>
                        <Link href={"/login"}><LoginLink>Sign in</LoginLink></Link>
                        <Link href={"/signup"}><SignupLink>Sign up</SignupLink></Link>
                    </div>
                ) :
                    (
                        <div>
                            <Link href={"/savedrecipes"}><MyRecipes>My Recipes</MyRecipes></Link>
                            <SignoutLink onClick={logout}>
                                Sign Out
                            </SignoutLink>
                        </div>
                    )}
            </NavRight>
        </Nav>
    )
}

export default Navbar;