import styled from 'styled-components';
import { HiCircleStack } from 'react-icons/hi2';
import { HiMiniFolderPlus } from 'react-icons/hi2';
import { useTheme } from '../services/ThemeContext';
import { MdOutlineDashboardCustomize } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useLogout } from '../services/apiAuth';
import { RiLogoutCircleRLine } from 'react-icons/ri';

const StyledQuickNav = styled.div`
  width: inherit;
  height: 7rem;
  background-color: var(--color-white);
  margin-top: 1rem;
  border-radius: 8px;
  padding-top: 10px;
  padding-left: 10px;
  /* border: 2px solid black; */
  /* box-shadow: 0px 0px 0px 2px gray; */
`;

const StyledShortcut = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 5px;
`;

function QuickNav() {
  const { primaryColor } = useTheme();
  const { logoutUser } = useLogout();
  return (
    <StyledQuickNav>
      <p style={{ fontSize: 'small' }}>Quick Actions</p>

      <StyledShortcut style={{ fontSize: '20px' }}>
        <Link to="/dashboard/manageclass">
          <HiMiniFolderPlus style={{ color: primaryColor }} />
        </Link>

        <Link to="/managestudentaccess">
          <HiCircleStack style={{ color: primaryColor }} />
        </Link>
        {/* <Link>
          <HiMiniMagnifyingGlass style={{ color: primaryColor }} />
        </Link> */}
        <Link to="/customize">
          <MdOutlineDashboardCustomize style={{ color: primaryColor }} />
        </Link>
        <button onClick={logoutUser}>
          <RiLogoutCircleRLine style={{ color: primaryColor }} />
        </button>
      </StyledShortcut>
    </StyledQuickNav>
  );
}

export default QuickNav;
