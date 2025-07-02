import React, { useState } from 'react';
import styled from 'styled-components';
import menuImg from '../../assets/menu.png';
import Menu from './Menu';
import Logo from '../../assets/logo.svg'; // Import the logo image
import { Link } from 'react-router-dom';
const NavbarContainer = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    position: relative;
`;

const IconWrapper = styled.div`
    cursor: pointer;
`;


const MenuDiv = styled.div`
    height: 100%;
    width: ${props => props.$isOpen ? '250px' : '0'};
    position: fixed;
    z-index: 1;
    top: 60px;
    right: 0;
    background-color: #C3E7F7;
    background-image: url(${menuImg}); /* Set menuImg as background */
    background-size: cover; /* Ensure the image covers the entire div */
    background-position: center; /* Center the image */
    background-color: #C3E7F7;
    overflow-x: hidden;
    transition: 0.1s;
    border-radius: 20px 0 0 20px;
`;

const AccountDiv = styled.div`
    padding: 30px;
`;


const Navbar = ({isMenuOpen, setOpenMenu}) => {

    return (
        <>
            {/* this component returns a navbar with a logo and a menu icon for mobile view */}
            <NavbarContainer>
                {/* Logo Icon */}
                <IconWrapper>
                    <Link to={"/"}><img src={Logo} alt="Logo" className="w-10 h-10" /></Link>
                    
                </IconWrapper>
                {/* Menu Icon */}
                <IconWrapper onClick={() => setOpenMenu(!isMenuOpen)}>
                    {isMenuOpen 
                    ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0-3.75-3.75M17.25 21 21 17.25" />
                  </svg>
                  
                    : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25" />
                    </svg>
                    }
                   
                </IconWrapper>
            </NavbarContainer>
            <MenuDiv $isOpen={isMenuOpen}>
                {/* Menu items for mobile view */}
                <AccountDiv className='flex flex-col'>
                    {/* avatar and username */}
                    <Menu onLinkClick={() => setOpenMenu(false)}/>
                </AccountDiv>
            </MenuDiv>
        </>
    );
}

export default Navbar;