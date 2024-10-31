import styled from 'styled-components';

const FileInput = styled.input.attrs({ type: 'file' })`
  font-size: 1.4rem;
  border-radius: var(--border-radius-sm);
  position: relative;
  left: 2rem;

  &::file-selector-button {
    font: inherit;
    font-weight: 500;
    padding: 0.8rem 1.2rem;
    margin-right: 1.2rem;
    border-radius: var(--border-radius-sm);
    border: none;
    color: black;
    background-color: var(--color-gray-300);
    cursor: pointer;
    transition: color 0.2s, background-color 0.2s;

    &:hover {
      background-color: #a8a8a8;
    }
  }
`;

export default FileInput;
