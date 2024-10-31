import styled from 'styled-components';
import NewStudents from '../../ui/NewStudents';
import { getSchoolStatistics } from '../../services/teachersService';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../ui/Spinner';
import SubjectGraph from './SubjectGraph';

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

const MeterContainer = styled.div`
  @media (max-width: 514px) {
    display: none;
    overflow: hidden;
    visibility: hidden;
  }
`;

function NewStudentContainer() {
  const { data: statistics, isLoading } = useQuery({
    queryFn: () => getSchoolStatistics(),
    queryKey: ['school stats'],
  });

  if (isLoading) return <Spinner />;

  const { students } = statistics;
  return (
    <StyledQuickActions>
      <NewStudents data={students} />
      <MeterContainer>
        <SubjectGraph />
      </MeterContainer>
    </StyledQuickActions>
  );
}

export default NewStudentContainer;
