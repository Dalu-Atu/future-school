import PropTypes from 'prop-types';
import styled from 'styled-components';
import { HiMoon, HiSun } from 'react-icons/hi2';
import { HiMiniCog8Tooth } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { useDarkMode } from '../services/DarkModeContext';

const StyledHeaderDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Greeting = styled.p`
  font-weight: 600;
  font-size: small;
  position: relative;
  left: 1rem;
  bottom: 0rem;
  @media (max-width: 1130px) {
    position: relative;
    left: 2.5rem;
  }
`;

const SubGreeting = styled.p`
  position: relative;
  left: 1rem;
  font-weight: 600;
  color: gray;
  font-size: small;
  position: relative;
  top: -0.5rem;
  @media (max-width: 1130px) {
    position: relative;
    left: 2.5rem;
  }
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 7rem;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0;
  border-radius: 30px;
  position: relative;
  left: 0rem;
`;

const IconButton = styled.button`
  position: relative;
  top: -0.3rem;
`;
function HeaderDetails({ user, type }) {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <StyledHeaderDetails>
      <div>
        <Greeting>Good Day {user}!</Greeting>
        <SubGreeting>
          {type === 'Admin' ? 'Get overview of all your work.' : type}
        </SubGreeting>
      </div>

      <IconContainer>
        <IconWrapper>
          <IconButton onClick={toggleDarkMode}>
            {isDarkMode ? <HiMoon size="20px" /> : <HiSun size="30px" />}
          </IconButton>
        </IconWrapper>

        <IconWrapper>
          <Link to={type !== 'Admin' ? '/account/profile' : '/customize'}>
            <HiMiniCog8Tooth size="20px" />
          </Link>
        </IconWrapper>
      </IconContainer>
    </StyledHeaderDetails>
  );
}

HeaderDetails.propTypes = {
  user: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default HeaderDetails;
