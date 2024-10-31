import styled from 'styled-components';
import HeaderDetails from './HeaderDetails';
import { BiMenu } from 'react-icons/bi';
import { useAuth } from '../services/AuthContext';

const StyledHeader = styled.header`
  position: relative; /* Ensure the menu icon stays in the header */
  padding: 1.2rem 2rem;
  height: 50px;
  background-color: var(--color-gray-200);
  /* box-shadow: 0 4px 6px -1px rgba(99, 99, 99, 0.1); */
`;

const MenuIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  left: 1rem;
  cursor: pointer;
  @media (min-width: 1130px) {
    visibility: hidden;
    display: none;
    overflow: hidden;
  }
`;

function Header({ toggleSidebar }) {
  const { user } = useAuth();
  return (
    <StyledHeader>
      <HeaderDetails user={user.data.username} type={user.cartegory} />
      <MenuIcon onClick={toggleSidebar}>
        <BiMenu size={'30px'} style={{ position: 'relative', top: '0.6rem' }} />
      </MenuIcon>
    </StyledHeader>
  );
}

export default Header;
