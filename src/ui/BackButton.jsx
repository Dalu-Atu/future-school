import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Btn = styled.button`
  padding-left: 1rem;
  padding-right: 1rem;
  border-radius: 15px;
  border-style: none;
  background-color: var(--color-gray-400);
  color: black;
  margin-top: 0.5rem;
`;
function BackButton() {
  const navigate = useNavigate();

  return (
    <Btn
      type="back"
      onClick={(e) => {
        e.preventDefault();
        navigate(-1);
      }}
    >
      &larr; Back
    </Btn>
  );
}

export default BackButton;
