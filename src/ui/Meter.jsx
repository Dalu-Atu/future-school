import styled from 'styled-components';
import ReadinMeter from './ReadinMeter';
import QuickNav from './QuickNav';

const StyledMeter = styled.div``;

function Meter() {
  return (
    <StyledMeter>
      <ReadinMeter />
      <QuickNav />
    </StyledMeter>
  );
}

export default Meter;
