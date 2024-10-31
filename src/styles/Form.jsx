import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledLabel = styled.label`
  position: relative;
  left: 5px;
`;
export function Label({ children }) {
  return <StyledLabel>{children}</StyledLabel>;
}

export const Input = styled.input`
  width: 28rem;
  border: 1px solid #bbbbbb;
  height: 3.5rem;
  background-color: #f7f7f7;
  padding-left: 5px;
  border-radius: 5px;
  padding: 5px;
`;

export const Select = styled.select`
  width: 28rem;
  border: 1px solid #bbbbbb;

  background-color: #f7f7f7;
  padding-left: 5px;
  border-radius: 5px;
  padding: 5px;
`;
const StyledFormRow = styled.div`
  padding: 1rem;
  padding-left: 5rem;
`;
export function FormRow({ children }) {
  return <StyledFormRow>{children}</StyledFormRow>;
}

const StyledForm = styled.form`

  box-shadow: -3px 3px 5px var(--color-gray-200),
  3px 3px 5px var(--color-gray-200);
  border-radius: 5px;-++
  border-radius: 10px;
  margin-top: 1rem;
  height: max-content;
  padding: 20px 0px 20px 0px;
  background-color: white;
  margin-left:auto;
  margin-right:auto;
`;

export function Form({ title, children, onSubmit }) {
  return (
    <StyledForm onSubmit={onSubmit}>
      <h2 style={{ textAlign: 'center', color: '#bdbdbd' }}>{title}</h2>
      {children}
    </StyledForm>
  );
}

Form.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.string,
  onSubmit: PropTypes.string,
};
Label.propTypes = {
  children: PropTypes.string.isRequired,
};
FormRow.propTypes = {
  children: PropTypes.string.isRequired,
};
Select.propTypes = {
  children: PropTypes.string.isRequired,
};

export default Form;
