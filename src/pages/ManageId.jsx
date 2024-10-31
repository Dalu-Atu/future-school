import styled from 'styled-components';
import ChooseClass from '../ui/ChooseClass';

const PageHeader = styled.h3`
  margin: 1rem;
`;
const StyledManageId = styled.div`
  padding: 2rem;
  height: calc(100vh - 58px);
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

function ManageId() {
  return (
    <StyledManageId>
      <PageHeader>Manage Id</PageHeader>
      <ChooseClass redirectRoute="generatedIds" btnLabel="Manage Id" />
    </StyledManageId>
  );
}

export default ManageId;
