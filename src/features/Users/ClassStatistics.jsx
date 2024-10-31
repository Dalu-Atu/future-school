import styled from 'styled-components';
import StatisticChart from '../../ui/StatisticChart';
import { getSchoolStatistics } from '../../services/teachersService';
import { useQuery } from '@tanstack/react-query';
import Spinner from '../../ui/Spinner';
import StatisticData from '../../ui/StatisticData';
// import StatisticData from './StatisticData';

const StyledStatisticsContainer = styled.div`
  display: grid;
  grid-template-columns: 60% 38%;
  grid-template-rows: 20rem;
  margin: 1rem;
  gap: 1.5rem;
  margin-top: 2rem;

  @media (max-width: 740px) {
    display: block;
  }
`;

function TeacherStats() {
  const { data: statistics, isLoading } = useQuery({
    queryFn: () => getSchoolStatistics(),
    queryKey: ['school stats'],
  });

  if (isLoading) return <Spinner />;

  const { students, teachers } = statistics;
  return (
    <StyledStatisticsContainer>
      <StatisticChart data={students} />
      <StatisticData />
    </StyledStatisticsContainer>
  );
}

export default TeacherStats;
