import styled from 'styled-components';
import Overview from './DashboardOverview';
import Management from './Management';
import '../../styles/responsive.css';

const StyledDashboard = styled.div`
  margin-top: 1rem;
  display: grid;
  grid-template-columns: 69% 29%;
  grid-column-gap: 0.5rem;
  padding: 0.5rem;
  height: calc(100vh - 70px);
  overflow: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: Just make scrollbar invisible */
  }
  scrollbar-width: none; /* For Firefox */

  @media (max-width: 850px) {
    grid-template-columns: 100%;
  }
  @media (max-width: 500px) {
  }
`;
const Optional = styled.div`
  visibility: visible;
  display: block;
  @media (max-width: 850px) {
    visibility: hidden;
    display: none;
  }
`;

function Dashboard() {
  return (
    <StyledDashboard className="styled-dashboard">
      <Overview />
      <Optional>
        <Management />
      </Optional>
    </StyledDashboard>
  );
}

export default Dashboard;
