'use client'
import styled from "styled-components";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/grocery4me-icon.png";
import { PowerIcon } from '@heroicons/react/24/outline';
import {useRouter} from "next/navigation";
import axios from "axios";
import { useContext } from "react";
import { LoginContext } from "@/app/LoginContext";

const Nav = styled.nav`
    height: 7vh;
    background: #c9c7b9;
    `;

const NavbarLogo = styled.a`
    padding: 0rem 0.5rem; 
    display: block;
    color: #000;
`;

const SignupLink = styled.a`
    padding: 0.25rem 0.75rem; 
    display: flex;
    float: right;
    position: relative;
    color: #000;
    border: 2px solid ${({ color }) => color || "#9c9c9c"};
    border-radius: 20px;
    background-color: #9c9c9c;
    &:hover {
        background-color: #737373;
        border-color: #737373;
    }
`;

const LoginLink = styled.a`
    padding: 0.25rem 0.75rem;
    margin-right: 0.5rem;
    display: flex;
    float: left;
    position: relative;
    color: #000;
    border: 2px solid ${({ color }) => color || "#9c9c9c"};
    border-radius: 20px;
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

const Navbar =  () => {
    const router = useRouter();
    const {isLoggedIn, setIsLoggedIn} = useContext(LoginContext);

    const logout = async () => {
        try {
            await axios.get('/api/users/logout');
            setIsLoggedIn(false);
            router.push('/login')
        } catch (error) {
            console.log(error.message)
        }
    };
    return (
        <Nav>
            <NavLeft>
                <Link href={"/"}>
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
                    <button onClick={logout} className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                        <PowerIcon className="w-6" />
                        <div className="hidden md:block">Sign Out</div>
                    </button>
                )}
            </NavRight>
        </Nav>
    ) 
}

export default Navbar;