import React from "react";
import Logo from "../components/Logo";
import mainLogo from "../assets/images/mainLogo2.png";
import styled from "styled-components";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        {/* info */}
        <div className="info">
          <h1>
            job <span>tracking</span> app
          </h1>
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Officia
            debitis voluptatibus dolor expedita necessitatibus nisi suscipit
            exercitationem ad commodi blanditiis non officiis nesciunt,
            praesentium maiores repellat! Saepe tenetur cumque sunt?{" "}
          </p>
          <Link to="/register" className="btn btn-hero">
            Login/Register
          </Link>
        </div>
        <img src={mainLogo} alt="job hunt" className="img main-img" />
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  nav {
    width: var(--fluid-width);
    max-width: var(--max-width);
    margin: 0 auto;
    height: var(--nav-height);
    display: flex;
    align-items: center;
  }
  .page {
    min-height: calc(100vh - var(--nav-height));
    display: grid;
    align-items: center;
    justify-items: center;
    margin-top: -3rem;
  }
  h1 {
    span {
      color: var(--primary-500);
    }
  }
  p {
    color: var(--grey-600);
  }
  .main-img {
    display: none;
  }
  @media (min-width: 768px) {
    .page {
      grid-template-columns: 2fr 1fr;
      column-gap: 3rem;
    }
    .main-img {
      display: block;
    }
  }
`;
export default Landing;
