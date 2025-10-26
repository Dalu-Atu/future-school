import styled from "styled-components";
import AppTopNav from "./TopNavBar";

import { Link, Navigate, Outlet } from "react-router-dom";

import { MdDashboard } from "react-icons/md";
import { TbReport } from "react-icons/tb";

import { LiaSchoolSolid } from "react-icons/lia";
import { BsCardChecklist, BsPerson } from "react-icons/bs";
import ManageActivities from "../Admin/ManageActivities";
import ManagementProfile from "../../ui/ManagementProfile";

import CoursesOverview from "../../ui/CoursesOverview";
import OptionalSidebar from "./OptionalSideBar";

const StyledAppLayout = styled.div`
  @media (min-width: 900px) {
    height: 100vh;
    margin-top: -2rem;
    margin-bottom: -3rem;
    overflow-x: hidden;
    display: grid;
    grid-template-columns: 69% 29%;
    grid-column-gap: 0.5rem;
    padding: 0.5rem;
    height: calc(100vh - 58px);
    overflow: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 0;
      background: transparent;
    }
    scrollbar-width: none;
  }
`;

const StyledDashboard = styled.div`
  display: grid;
  grid-template-columns: 70% 1fr;
  grid-template-columns: 100%;
  grid-column-gap: 0.5rem;
  padding: 0.5rem;
  overflow: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
    background: transparent;
  }
  scrollbar-width: none;
`;

const Management = styled.div`
  height: inherit;
  display: none;
  visibility: hidden;
  @media (min-width: 900px) {
    display: block;
    visibility: visible;
    background-color: var(--color-white);
    border-radius: 10px;
    position: relative;
    top: 1.3rem;
    overflow: hidden;
  }
`;

const Footer = styled.footer`
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.08), 0 -1px 3px rgba(0, 0, 0, 0.05);
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  padding: 0.5rem 0;

  @media (min-width: 900px) {
    display: none;
    visibility: hidden;
  }
`;

const Nav = styled.nav`
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
  }

  li {
    flex: 1;
    display: flex;
    justify-content: center;
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.75rem 1rem;
  color: var(--color-gray-600, #6b7280);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 12px;
  position: relative;
  min-width: 60px;

  &:hover {
    color: var(--color-primary, 
      #44A08D);
    background: rgba(59, 130, 246, 0.08);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  /* Active state indicator */
  &.active {
    color: var(--color-primary, 
      #44A08D);

    &::before {
      content: "";
      position: absolute;
      top: -0.5rem;
      left: 50%;
      transform: translateX(-50%);
      width: 30px;
      height: 3px;
      background: var(--color-primary, 
        #44A08D);
      border-radius: 0 0 3px 3px;
    }
  }

  p {
    margin: 0;
    line-height: 1;
  }

  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.25rem;
  }

  .label {
    font-size: 0.7rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }

  @media (min-width: 400px) {
    padding: 0.75rem 1.25rem;

    .label {
      font-size: 0.75rem;
    }
  }
`;

function TeacherNav() {
  const navItems = [
    { to: "/account/dashboard", icon: MdDashboard, label: "Home" },
    { to: "/account/managemarks", icon: BsCardChecklist, label: "Exam" },
    { to: "/account/managereports", icon: TbReport, label: "Report" },
    { to: "/account/classresults", icon: LiaSchoolSolid, label: "Results" },
    { to: "/account/profile", icon: BsPerson, label: "Profile" },
  ];

  return (
    <Nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.to}>
            <StyledLink to={item.to}>
              <div className="icon-wrapper">
                <item.icon size={20} />
              </div>
              <p className="label">{item.label}</p>
            </StyledLink>
          </li>
        ))}
      </ul>
    </Nav>
  );
}

function StudentsNav() {
  const navItems = [
    { to: "/account/dashboard", icon: MdDashboard, label: "Home" },
    { to: "/viewresult", icon: TbReport, label: "Result" },
    { to: "/account/profile", icon: BsPerson, label: "Profile" },
  ];

  return (
    <Nav>
      <ul>
        {navItems.map((item) => (
          <li key={item.to}>
            <StyledLink to={item.to}>
              <div className="icon-wrapper">
                <item.icon size={20} />
              </div>
              <p className="label" style={{fontSize:'13px'}}>{item.label}</p>
            </StyledLink>
          </li>
        ))}
      </ul>
    </Nav>
  );
}

function TeachersDashboard({ user }) {
  return (
    <>
      <AppTopNav user={user?.data?.username} type={user?.cartegory} />
      <StyledAppLayout>
        <StyledDashboard>
          <Outlet />
          <Footer>
            {user.cartegory === "Teacher" ? <TeacherNav /> : <StudentsNav />}
          </Footer>
        </StyledDashboard>

        <Management>
          <ManageActivities>
            <ManagementProfile />
            <CoursesOverview />
            <OptionalSidebar cartegory={user.cartegory} />
          </ManageActivities>
        </Management>
      </StyledAppLayout>
    </>
  );
}

export default TeachersDashboard;
