import styled from 'styled-components';
import Analytics from '../../ui/Analytics';
import StatisticsContainer from '../../ui/StatisticsContainer';
import QuickActions from '../../ui/QuickActions';
import { useQuery } from '@tanstack/react-query';
import { getSchoolStatistics } from '../../services/teachersService';
import Spinner from '../../ui/Spinner';

const OverviewdManagement = styled.div``;

function Overview() {
  const { data: statistics, isLoading } = useQuery({
    queryFn: () => getSchoolStatistics(),
    queryKey: ['school stats'],
  });

  if (isLoading) return <Spinner size="medium" />;

  const { students } = statistics;

  return (
    <OverviewdManagement>
      <Analytics data={statistics} />
      <StatisticsContainer data={students} />
      <QuickActions data={students} />
    </OverviewdManagement>
  );
}

export default Overview;
