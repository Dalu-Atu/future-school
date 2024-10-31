import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

const StyledManagement = styled.div`
  border-radius: 10px;
  background-color: var(--color-white);
  margin-top: 1rem;
`;

function Management() {
  return (
    <StyledManagement>
      <Outlet />
    </StyledManagement>
  );
}

export default Management;
