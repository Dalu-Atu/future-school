import styled from 'styled-components';
import AnalyticsBox from '../../ui/AnalyticsBox';
import PropTypes from 'prop-types';

const StyledAnalytics = styled.div`
  margin: 1rem;
  display: grid;
  // grid-template-columns: 1fr 1fr 1fr;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: center;
  overflow: hidden;
`;

function UserAnalytics({ children }) {
  return <StyledAnalytics>{children}</StyledAnalytics>;
}

UserAnalytics.propTypes = {
  children: PropTypes.node.isRequired,
};

export default UserAnalytics;
