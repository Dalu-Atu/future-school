import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useTheme } from '../services/ThemeContext';
const StyledButton = styled.button`
  color: white;
  background-color: #000;
  padding: 5px;
  border-style: none;
  border-radius: 5px;
  width: max-content;
  padding-left: 20px;
  padding-right: 20px;
  height: 32px;
  display: flex;
  align-items: center;
  background-color: #8a8a8a;
`;

function Button({ children, onClick, type, disabled }) {
  const { primaryColor } = useTheme();
  if (type === 'approve') type = primaryColor;
  if (type === 'danger') type = '#ef4444';
  if (type === 'normal') type = '#6b6b6b';
  if (!type) type = primaryColor;
  return (
    <StyledButton
      disabled={disabled}
      style={{ backgroundColor: type }}
      onClick={onClick}
    >
      {children}
    </StyledButton>
  );
}

Button.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.number.isRequired,
  colour: PropTypes.number.isRequired,
  type: PropTypes.number.isRequired,
  disabled: PropTypes.number.isRequired,
};

export default Button;
