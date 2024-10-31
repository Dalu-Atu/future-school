import { Progress } from 'react-sweet-progress';
import 'react-sweet-progress/lib/style.css';
import PropTypes from 'prop-types'; // Import PropTypes for prop validation

function ProgressBar({ actcolour, symbol }) {
  let specifiedSymbol = `${symbol}` ? symbol : ' ';
  return (
    <Progress
      color={'#10b981'}
      height={1}
      percent={73}
      theme={{
        success: {
          symbol: '',
          color: '#3873f1',
        },
        active: {
          symbol: specifiedSymbol,
          color: actcolour,
        },
        error: {
          symbol: '?',
          color: '#fbc630',
        },
        default: {
          symbol: ``,
          color: '#3873f1',
        },
      }}
    />
  );
}

ProgressBar.propTypes = {
  actcolour: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
};

export default ProgressBar;
