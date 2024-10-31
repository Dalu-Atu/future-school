import styled from 'styled-components';
import ProgressBar from './ProgressBar';
import { useTheme } from '../services/ThemeContext';

const StyledTermDuration = styled.div`
  margin: 1.5rem;
  margin-top: 3rem;
  text-align: start;
  color: var(--color-gray-500);
`;

function TermDuration() {
  const { primaryColor } = useTheme();
  return (
    <StyledTermDuration>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h4>Term Duration</h4>
      </div>
      <ProgressBar actcolour={primaryColor} symbol="73%" />
    </StyledTermDuration>
  );
}

export default TermDuration;
