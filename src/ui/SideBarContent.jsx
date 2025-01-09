import { NavLink } from "react-router-dom";
import styled from "styled-components";
import avatar from "../assets/woman.avif";
import PropTypes from "prop-types";
import {
  MdGroup,
  MdMenuBook,
  MdOutlineDashboardCustomize,
} from "react-icons/md";
import { MdAddCard } from "react-icons/md";
import { TbDashboard, TbReport } from "react-icons/tb";

import { LiaSchoolSolid } from "react-icons/lia";
import { BsCardChecklist } from "react-icons/bs";
import { useTheme } from "../services/ThemeContext";
import { useSettings } from "../services/settingContext";
import { useAuth } from "../services/AuthContext";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useLogout } from "../services/apiAuth";
import Spinner from "./Spinner";

const StyledSideBarLogo = styled.div`
  gap: 1rem;
  margin: 0.9rem;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
  color: var(--color-gray-700);
  font-weight: bold;
  position: relative;
  left: 0.5rem;
`;
const FooterDetails = styled.div`
  display: grid;
  grid-template-columns: 20% 1fr 20%;
  align-items: center;
  padding-left: 1.5rem;
`;
const FooterImg = styled.img`
  width: 4.5rem;
  height: 4.5rem;
  border-radius: 50%;
`;
const FooterName = styled.div`
  /* color: var(--color-white); */
  margin-left: 1rem;
  line-height: 14px;
`;
const Optional = styled.div`
  visibility: hidden;
  display: none;
  @media (max-width: 850px) {
    visibility: visible;
    display: block;
  }
`;
const StyledSideBarList = styled(({ hoverColor, ...props }) => (
  <NavLink {...props} />
))`
  display: flex;
  align-items: center;
  margin-top: 1rem;
  gap: 1rem;
  padding-left: 20px;
  height: 4.5rem;
  color: var(--color-gray-500);

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || ""};
    border-radius: 5px;
  }
`;
const Footer = styled.footer`
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  width: 250px;
  color: var(--color-gray-500);
`;

function SideBarLogo() {
  const settings = useSettings();
  return (
    <StyledSideBarLogo>
      <div style={{ display: "flex", fontSize: "small", alignItems: "center" }}>
        <img
          style={{
            width: "6rem",
            // height: '5.5rem',
          }}
          src={settings.images.logo}
          alt="logo"
        />
        <h4
          style={{
            position: "relative",
            left: "0.5rem",
            top: "",
          }}
        >
          {settings.schoolName}
        </h4>
      </div>
    </StyledSideBarLogo>
  );
}

function SideBarList({ icon, label, linkDestination }) {
  const { primaryColor, secondaryColor } = useTheme();
  return (
    <StyledSideBarList
      hoverColor={"var(--color-gray-300)"}
      className="navlist"
      to={linkDestination}
    >
      <p style={{ position: "relative", top: "0.2rem", left: "0.4rem" }}>
        {icon}
      </p>
      <p>{label}</p>
    </StyledSideBarList>
  );
}

function SideBarContent() {
  const { primaryColor } = useTheme();
  const { user } = useAuth();
  const { logoutUser, isPending } = useLogout();
  if (isPending) return <Spinner />;
  return (
    <div>
      <SideBarLogo />
      <div style={{ margin: "2rem" }}></div>
      <SideBarList
        icon={<TbDashboard style={{ color: primaryColor }} size={"25px"} />}
        label="Dashboard"
        linkDestination="/dashboard"
      />
      <SideBarList
        icon={<MdAddCard style={{ color: primaryColor }} size={"23px"} />}
        label="Manage ID Cards"
        linkDestination="/mangeid"
      />
      <SideBarList
        icon={<TbReport style={{ color: primaryColor }} size={"26px"} />}
        label="Manage Student Reports"
        linkDestination="/managepsycomotor"
      />
      <SideBarList
        icon={<BsCardChecklist style={{ color: primaryColor }} size={"23px"} />}
        label="Manage Results"
        linkDestination="/results"
      />
      <Optional>
        <SideBarList
          icon={
            <LiaSchoolSolid style={{ color: primaryColor }} size={"25px"} />
          }
          label="Manage School"
          linkDestination="/manageschool"
        />
      </Optional>
      <SideBarList
        icon={<MdGroup style={{ color: primaryColor }} size={"25px"} />}
        label="Manage Student Access"
        linkDestination="/managestudentaccess"
      />
      <SideBarList
        icon={
          <MdOutlineDashboardCustomize
            style={{ color: primaryColor }}
            size={"25px"}
          />
        }
        label="Customize UI"
        linkDestination="/customize"
      />
      <SideBarList
        icon={<MdMenuBook style={{ color: primaryColor }} size={"25px"} />}
        label="View BroadSheet"
        linkDestination="/view-broadsheet"
      />

      <Footer>
        <FooterDetails>
          <FooterImg src={user.data.image || avatar} />
          <FooterName>
            <p>{user.data.name}</p>
            <span style={{ fontSize: "small", textAlign: "left" }}>
              {user.cartegory}
            </span>
          </FooterName>
          <button onClick={() => logoutUser()}>
            <RiLogoutCircleRLine size={"20px"} />
          </button>
        </FooterDetails>
      </Footer>
    </div>
  );
}

SideBarList.propTypes = {
  label: PropTypes.string.isRequired,
  icon: PropTypes.object.isRequired,
  linkDestination: PropTypes.string.isRequired,
};
export default SideBarContent;
