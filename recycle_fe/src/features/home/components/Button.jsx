import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledLink = styled.a`
    display: flex;
    background: #ffffffe6;
    border-radius: 10px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    text-decoration: none;
    box-shadow: rgba(38, 20, 126, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
    display: flex;
    border-top: 7px solid #92dd7a;
`;

const Button = function ({ image, url, text }) {

    //this component is a link. It contains an icon and a text below the image.
    return (
        <StyledLink as={Link} to={url}>
            <img src={image} alt="Recycle Now" className="w-20 h-20" />
            <p className="mt-2">{text}</p>
        </StyledLink>
    )
}

export default Button;