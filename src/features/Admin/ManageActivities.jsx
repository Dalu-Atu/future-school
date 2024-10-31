import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyleManageActivities = styled.div`
  display: grid;
  background-color: var(--color-white);
  border-radius: 10px;
`;

function ManageActivities({ children }) {
  return <StyleManageActivities>{children}</StyleManageActivities>;
}
ManageActivities.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ManageActivities;
