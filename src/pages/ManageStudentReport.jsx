import styled from "styled-components";
import { useLocation } from "react-router-dom";
import ScoreFormContainer from "../features/Users/StudentReportFormContainer";
import ChooseClass from "../ui/ChooseClass";

const PageHeader = styled.h3`
  margin: 1rem;
`;
const StyledManagePscychomotor = styled.div`
  padding: 2rem;
  height: calc(100vh - 58px);
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;

function ManagePsychomotor() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedClass = params.get("class");

  if (selectedClass)
    return <ScoreFormContainer selectedClass={selectedClass} />;

  return (
    <StyledManagePscychomotor>
      <PageHeader>Manage Student Reports</PageHeader>
      <ChooseClass btnLabel="Manage Report" redirectRoute="managepsycomotor" />
    </StyledManagePscychomotor>
  );
}

export default ManagePsychomotor;
