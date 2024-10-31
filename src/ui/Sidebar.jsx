import styled from 'styled-components';
import SideBarContent from './SideBarContent';
import { forwardRef } from 'react';
const StyledSidebar = styled.aside`
  position: fixed;
  top: 0;
  left: ${(props) =>
    props.$visible === 'true'
      ? '0'
      : '-25rem'}; /* Hide the sidebar by default */
  width: 25rem;
  height: 100vh;
  transition: left 0.3s ease; /* Add transition effect for smooth animation */
  background-color: var(--color-gray-100);
  backdrop-filter: blur(10px); /* Glass effect */
  box-shadow: -4px 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow */
  box-sizing: border-box;
  grid-row: 2;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  z-index: 1;
  grid-row: 1 / -1;

  @media (max-width: 1130px) {
  }
  @media (min-width: 1130px) {
    position: relative;
    left: 0;
    backdrop-filter: blur(20px);
    box-shadow: -4 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow */
    box-sizing: border-box;

    grid-row: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: 3.2rem;

    overflow: hidden;
  }
`;

const Sidebar = forwardRef(({ visible, toggleSidebar }, ref) => {
  return (
    <StyledSidebar
      ref={ref}
      onClick={toggleSidebar}
      $visible={visible.toString()}
    >
      <SideBarContent />
    </StyledSidebar>
  );
});
Sidebar.displayName = 'Sidebar';

export default Sidebar;
