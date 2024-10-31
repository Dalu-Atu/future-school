import { Riple } from 'react-loading-indicators';
import styled from 'styled-components';
import { useTheme } from '../services/ThemeContext';

const StyledSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
`;

function SpinnerOrdinary() {
  const themes = useTheme();

  return (
    <StyledSpinner>
      <Riple
        style={{ zIndex: '2000000' }}
        color={themes.primaryColor}
        size={'medium'}
        textColor="gray"
      />
    </StyledSpinner>
  );
}

export default SpinnerOrdinary;
