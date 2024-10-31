import styled from 'styled-components';

import ChooseClass from '../ui/ChooseClass';

const PageHeader = styled.h3`
  margin: 1rem;
`;
const StyledManageResult = styled.div`
  height: calc(100vh - 100px);
  padding: 2rem;
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

function ViewSTudentResults() {
  return (
    <StyledManageResult>
      <PageHeader>View Class Results</PageHeader>
      <ChooseClass redirectRoute="class-results" btnLabel="View Results" />
    </StyledManageResult>
  );
}

export default ViewSTudentResults;
