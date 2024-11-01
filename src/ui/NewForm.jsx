import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import "../styles/formstyles.css";
import { useTheme } from "../services/ThemeContext";
import styled from "styled-components";

export const SelectBox = forwardRef(
  ({ children, label, type, placeholder, value, ...rest }, ref) => {
    return (
      <div className="input-box">
        <label>{label}</label>
        <select
          style={{
            backgroundColor: "var(--color-gray-100)",
            color: "var(--color-gray-600)",
          }}
          ref={ref}
          defaultValue={value}
          placeholder={placeholder}
          required
          type={type}
          {...rest}
        >
          {children}
        </select>
      </div>
    );
  }
);

export const InputBox = forwardRef(
  ({ label, type, placeholder, value, ...rest }, ref) => {
    return (
      <div className="input-box">
        <label>{label}</label>
        <input
          style={{
            backgroundColor: "var(--color-gray-100)",
            color: "var(--color-gray-600)",
          }}
          ref={ref}
          defaultValue={value}
          placeholder={placeholder}
          required
          type={type}
          {...rest}
        />
      </div>
    );
  }
);

export function InputColumn({ children }) {
  return <div className="column">{children}</div>;
}

function NewForm({ formName, children, onSubmit, action }) {
  const { primaryColor } = useTheme();
  return (
    <section className="container">
      <header>{formName}</header>
      <form className="form" onSubmit={onSubmit}>
        {children}
        <button
          style={{ backgroundColor: primaryColor }}
        >{` ${action}`}</button>
      </form>
    </section>
  );
}
const Container = styled.div`
  float: left;
  overflow: hidden;
  padding: 1rem;
`;

const SubmitButton = styled.button`
  border-radius: 5px;
  border: none;
  color: #f9fafb;
  background-color: ${({ primaryColor }) => primaryColor};
  padding: 0rem 1rem;
  font-size: 15px;
  height: 3.5rem;
  position: relative;
  top: 0rem;
  min-width: 12rem;
  width: "fit-content";
  @media (min-width: 601px) {
    align-self: flex-start;
  }

  @media (max-width: 600px) {
    align-self: stretch;
  }
`;

export function SelectionForm({ btn, children, submit }) {
  const { primaryColor } = useTheme();

  return (
    <Container className="container">
      <InputColumn>
        {children}
        <SubmitButton primaryColor={primaryColor} onClick={submit}>
          {btn}
        </SubmitButton>
      </InputColumn>
    </Container>
  );
}

SelectionForm.propTypes = {
  submit: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  btn: PropTypes.node.isRequired,
};

SelectBox.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
InputBox.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};
NewForm.propTypes = {
  children: PropTypes.node.isRequired,
  onSubmit: PropTypes.string.isRequired,
  action: PropTypes.string.isRequired,
  formName: PropTypes.string.isRequired,
};
InputColumn.propTypes = {
  children: PropTypes.string.isRequired,
};
// Set the display name for better debugging
InputBox.displayName = "InputBox";
SelectBox.displayName = "SelectBox";
export default NewForm;
