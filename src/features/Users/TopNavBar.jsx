import PropTypes from 'prop-types';
import styled from 'styled-components';
import HeaderDetails from '../../ui/HeaderDetails';

const StyledHeader = styled.header`
  padding-top: 1rem;
  background-color: var(--color-gray-200);
`;

const StyledHeaderDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function AppTopNav({ user, type }) {
  return (
    <StyledHeader>
      <HeaderDetails user={user} type={type} />
    </StyledHeader>
  );
}

AppTopNav.propTypes = {
  user: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
export default AppTopNav;
