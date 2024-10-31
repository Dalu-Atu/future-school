import styled from 'styled-components';
import PropTypes from 'prop-types';
import { HiOutlineChevronRight } from 'react-icons/hi2';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../services/ThemeContext';

const StyledOption = styled(NavLink)`
  width: inherit;
  margin: 2rem;
  display: grid;
  grid-template-columns: 20% 1fr 20%;
  align-items: center;
  height: 4rem;
  /* border: 0.5px solid lightgray; */
  transition: border-color 0.3s ease, background-color 0.3s ease;
  text-decoration: none; /* Ensure no underline */

  &:hover {
    background-color: ${({ hovercolor }) => hovercolor || ''};
    color: var(--color-gray-200);
    border-radius: 5px;
  }

  &:hover .icon-wrapper {
    background-color: ${({ hovercolor }) => hovercolor || ''};
  }
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  height: 4rem;
  width: 4rem;
  background-color: ${({ $bg }) => $bg};
  color: ${({ $colour }) => $colour};
  font-size: 22px;
  transition: background-color 0.3s ease;
`;

const ValueWrapper = styled.div`
  /* Add any required styling here */
`;

const ChevronWrapper = styled.div`
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  position: relative;
  left: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: gray;
`;

function Option({ icon, value, colour, bg, destination }) {
  const { primaryColor } = useTheme();
  return (
    <StyledOption to={destination} hovercolor={primaryColor}>
      <IconWrapper className="icon-wrapper" $bg={bg} $colour={colour}>
        <div style={{ position: 'relative', top: '0.3rem' }}>{icon}</div>
      </IconWrapper>
      <ValueWrapper>{value}</ValueWrapper>
      <ChevronWrapper>
        <HiOutlineChevronRight />
      </ChevronWrapper>
    </StyledOption>
  );
}

export default Option;
