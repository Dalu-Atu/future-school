import PropTypes from 'prop-types';
import styled from 'styled-components';

export const Label = styled.label`
  position: relative;
  left: -5px;
  @media (max-width: 458px) {
    position: relative;
    left: 5px;
  }
`;

export const Input = styled.input`
  width: 28rem;
  border: 1px solid var(--color-gray-400);
  height: 4rem;
  /* background-color: #f7f7f7; */
  padding-left: 5px;
  border-radius: 5px;
  padding: 5px;
  // position: relative;
  // left: 8px;
`;

export const Select = styled.select`
  width: 28rem;
  border: 1px solid var(--color-gray-400);
  height: 4rem;
  background-color: inherit;
  padding-left: 5px;
  border-radius: 5px;
  padding: 5px;
`;
const StyledFormRow = styled.div`
  padding: 0.5rem;
  padding-left: 2rem;
`;
export function FormRow({ children }) {
  return <StyledFormRow>{children}</StyledFormRow>;
}

const StyledForm = styled.form`
  width: fit-content;
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
