import { Riple } from 'react-loading-indicators';
import styled from 'styled-components';

const StyledSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: lightgray;
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

function Spinner({ size }) {
  return (
    <Overlay>
      <StyledSpinner>
        <Riple
          style={{ zIndex: '2000000' }}
          color={'#2e8555'}
          size={size}
          textColor="gray"
        />
      </StyledSpinner>
    </Overlay>
  );
}

export default Spinner;
