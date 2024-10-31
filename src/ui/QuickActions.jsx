import styled from 'styled-components';
import Meter from './Meter';
import NewStudents from './NewStudents';
import PropTypes from 'prop-types';

const StyledQuickActions = styled.div`
  display: grid;
  grid-template-columns: 60% 38%;
  grid-template-rows: 32rem;
  margin: 1rem;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 514px) {
    grid-template-columns: 100%;
    overflow: hidden;
  }
`;
function QuickActions({ data }) {
  return (
    <StyledQuickActions>
      <NewStudents data={data} />
      <Meter />
    </StyledQuickActions>
  );
}
QuickActions.propTypes = {
  data: PropTypes.object.isRequired,
};

export default QuickActions;
