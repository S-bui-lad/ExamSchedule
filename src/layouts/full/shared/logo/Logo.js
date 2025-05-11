import { Link } from "react-router-dom";
import LogoDark1 from "src/assets/images/logos/Logo_HAU.png";
import { styled } from "@mui/material";

const LinkStyled = styled(Link)(() => ({
  overflow: "hidden",
  display: "block",
}));

const Logo = () => {
  return (
    <LinkStyled
      to="/"
      height={70}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <img src={LogoDark1} alt="logo" height="70" /> {/* Use as img tag */}
    </LinkStyled>
  );
};

export default Logo;