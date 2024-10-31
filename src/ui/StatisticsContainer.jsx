import styled from 'styled-components';
import StatisticChart from './StatisticChart';
import StatisticData from './StatisticData';

const StyledStatisticsContainer = styled.div`
  display: grid;
  grid-template-columns: 60% 38%;
  grid-template-rows: 20rem;
  margin: 1rem;
  gap: 1.5rem;
  margin-top: 2rem;
  @media (max-width: 742px) {
    grid-template-columns: 100%;
    overflow: hidden;
  }
`;

function StatisticsContainer({ data }) {
  return (
    <StyledStatisticsContainer>
      <StatisticChart data={data} />
      <StatisticData />
    </StyledStatisticsContainer>
  );
}

export default StatisticsContainer;
