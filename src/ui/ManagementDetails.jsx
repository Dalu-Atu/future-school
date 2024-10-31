import styled from 'styled-components';

const StyledManageDetails = styled.div`
  /* height: 45rem; */
  /* border: 2px solid rebeccapurple; */
`;
function ManagementDetails({ children }) {
  return <StyledManageDetails>{children}</StyledManageDetails>;
}

export default ManagementDetails;
