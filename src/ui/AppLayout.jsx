import { useState, useEffect, useRef } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Header from './StyledHeader';
import Sidebar from './Sidebar';
import styled from 'styled-components';
import { useAuth } from '../services/AuthContext';

const StyledAppLayout = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: 25rem 1fr;
  grid-template-rows: auto 1fr;
  margin-top: -1rem;
  margin-bottom: -3rem;

  @media (max-width: 1130px) {
    grid-template-columns: 1fr;
  }
`;

const StyledMain = styled.main`
  @media (max-width: 1130px) {
    grid-column: span 2;
    &.blurred {
      filter: blur(5px); /* Add blur effect */
      pointer-events: none; /* Disable pointer events */
    }
  }

  /* Define a CSS class for blur effect */
`;

function AppLayout() {
  const { user } = useAuth();
  const [sidebarVisible, setSidebarVisible] = useState(false); // State to manage sidebar visibility
  const [isBlurred, setIsBlurred] = useState(false); // State to manage blur effect
  const mainRef = useRef(null); // Reference to the main content area
  const sidebarRef = useRef(null); // Reference to the sidebar

  useEffect(() => {
    // Event listener to handle clicks outside the sidebar
    const handleClickOutside = (event) => {
      if (
        sidebarVisible &&
        mainRef.current &&
        !mainRef.current.contains(event.target) &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setSidebarVisible(false); // Close the sidebar
        setIsBlurred(false); // Remove the blur effect
      }
    };

    // Attach the event listener when the sidebar is visible
    if (sidebarVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove the event listener when the sidebar is closed
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup: Remove event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarVisible]);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
    setIsBlurred(!isBlurred);
  };

  if (user.cartegory !== 'Admin') return <Navigate to={'/login'} replace />;

  return (
    <StyledAppLayout>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar
        ref={sidebarRef}
        visible={sidebarVisible}
        toggleSidebar={toggleSidebar}
      />
      <StyledMain ref={mainRef} className={isBlurred ? 'blurred' : ''}>
        <Outlet />
      </StyledMain>
    </StyledAppLayout>
  );
}

export default AppLayout;
