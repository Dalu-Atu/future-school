import styled from 'styled-components';
import AppTopNav from './TopNavBar';

import { Link, Navigate, Outlet } from 'react-router-dom';

import { MdDashboard } from 'react-icons/md';
import { TbReport } from 'react-icons/tb';

import { LiaSchoolSolid } from 'react-icons/lia';
import { BsCardChecklist, BsPerson } from 'react-icons/bs';
import ManageActivities from '../Admin/ManageActivities';
import ManagementProfile from '../../ui/ManagementProfile';

import CoursesOverview from '../../ui/CoursesOverview';
import OptionalSidebar from './OptionalSideBar';

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
      width: 0; /* Remove scrollbar space */
      background: transparent; /* Optional: Just make scrollbar invisible */
    }
    scrollbar-width: none; /* For Firefox */
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
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: Just make scrollbar invisible */
  }
  scrollbar-width: none; /* For Firefox */
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
    /* height: max-content; */
    overflow: hidden;
  }
`;

const Footer = styled.footer`
  background-color: var(--color-gray-100);
  backdrop-filter: blur(10px); /* Glass effect */
  text-align: center;
  padding: 10px 0;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Softer shadow */
  border-top: 1px solid rgba(255, 255, 255, 0.2); /* Optional border to enhance the glass effect */
  color: var(--color-gray-700); /* Ensure text is readable */

  @media (min-width: 900px) {
    display: none;
    visibility: hidden;
  }
`;

const Nav = styled.nav`
  ul {
    list-style-type: none;
    padding: 0;
    display: flex;
    justify-content: space-between;
    padding-left: 3rem;
    padding-right: 3rem;
    height: 3.7rem;
    margin: 0;
  }
  li:hover {
    color: black;
  }
`;

const StyledLink = styled(Link)``;

function TeacherNav() {
  return (
    <Nav>
      <ul>
        <li>
          <StyledLink to={'/account/dashboard'}>
            <p
              style={{
                position: 'relative',
                top: '0rem',
              }}
            >
              <MdDashboard size={'18px'} />
            </p>
            <p style={{ position: 'relative', top: '-1rem' }}>Home</p>{' '}
          </StyledLink>
        </li>
        <li>
          <StyledLink to={'/account/managemarks'}>
            <p style={{ position: 'relative', top: '0rem' }}>
              <BsCardChecklist size={'18px'} />
            </p>{' '}
            <p style={{ position: 'relative', top: '-1rem' }}>Exam</p>{' '}
          </StyledLink>
        </li>
        <li>
          <StyledLink to={'/account/managereports'}>
            <p style={{ position: 'relative', top: '0rem' }}>
              <TbReport size={'18px'} />
            </p>{' '}
            <p style={{ position: 'relative', top: '-1rem' }}>Report</p>{' '}
          </StyledLink>
        </li>
        <li>
          <StyledLink to={'/account/classresults'}>
            <p style={{ position: 'relative', top: '0rem' }}>
              <LiaSchoolSolid size={'18px'} />
            </p>
            <p style={{ position: 'relative', top: '-1rem' }}>View Results</p>
          </StyledLink>
        </li>
        <li>
          <StyledLink to={'/account/profile'}>
            <p style={{ position: 'relative', top: '0rem' }}>
              <BsPerson size={'18px'} />
            </p>
            <p style={{ position: 'relative', top: '-1rem' }}>Profile</p>
          </StyledLink>
        </li>
      </ul>
    </Nav>
  );
}
function StudentsNav() {
  return (
    <Nav>
      <ul>
        <li>
          <StyledLink to={'/account/dashboard'}>
            <p style={{ position: 'relative', top: '0rem' }}>
              <MdDashboard size={'18px'} />
            </p>
            <p style={{ position: 'relative', top: '-1rem' }}>Home</p>{' '}
          </StyledLink>
        </li>
        {/* <li>
          <StyledLink to={'/account/managemarks'}>
            <p style={{ position: 'relative', top: '0rem' }}>
              <BsCardChecklist size={'18px'} />
            </p>
            <p style={{ position: 'relative', top: '-1rem' }}>Exam</p>{' '}
          </StyledLink>
        </li> */}
        <li>
          <StyledLink to={'/viewresult'}>
            <p style={{ position: 'relative', top: '0rem' }}>
              <TbReport size={'18px'} />
            </p>{' '}
            <p style={{ position: 'relative', top: '-1rem' }}>View Result</p>{' '}
          </StyledLink>
        </li>
        <li>
          <StyledLink to={'/account/profile'}>
            <p style={{ position: 'relative', top: '0rem' }}>
              <BsPerson size={'18px'} />
            </p>
            <p style={{ position: 'relative', top: '-1rem' }}>Profile</p>
          </StyledLink>
        </li>
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
            {user.cartegory === 'Teacher' ? <TeacherNav /> : <StudentsNav />}
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
