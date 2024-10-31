import styled from 'styled-components';
import Button from './Button';

const StyledNewIntake = styled.div`
  /* background-color: var(--color-white); */
  position: relative;
  top: -1.2rem;
  border-radius: 10px;
  overflow: hidden;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: Just make scrollbar invisible */
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none; /* For Firefox */
`;

const Header = styled.div`
  position: relative;
  left: 2rem;
  top: 1rem;
  font-weight: 500;
  color: #989da5;
`;

const SearchBar = styled.div`
  display: flex;
  justify-content: space-around;
  width: 10rem;
`;

const SearchInput = styled.input`
  border: 1px solid black;
`;

const Content = styled.div``;

function NewIntake({ label1, label2, children, toggleForm }) {
  return (
    <StyledNewIntake>
      <Header>
        <p>{label1}</p>
        {label2 && (
          <SearchBar>
            <SearchInput placeholder="search" type="text" />
            <Button type={'approve'} onClick={toggleForm}>
              {label2}
            </Button>
          </SearchBar>
        )}
      </Header>
      <Content>{children}</Content>
    </StyledNewIntake>
  );
}

export default NewIntake;
