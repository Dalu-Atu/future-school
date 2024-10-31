import PropTypes from 'prop-types';
import { BiSearch } from 'react-icons/bi';
import styled from 'styled-components';
import { useTheme } from '../services/ThemeContext';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 2rem;
  margin-top: 1.5rem;
`;

const PageHeader = styled.h3`
  margin: 1rem;

  @media (max-width: 614px) {
    font-size: 15px;
  }
  @media (max-width: 546px) {
    display: none;
    visibility: hidden;
  }
`;

const Search = styled.div`
  display: flex;
  justify-content: space-between;
  width: 37rem;

  @media (max-width: 520px) {
    position: relative;
    right: 1rem;
  }

  @media (max-width: 408px) {
    /* width: 100vw; */
  }
  /* @media (max-width: 582px) {
    width: calc(100vw - 1rem);
  } */
`;

const InputContainer = styled.div`
  border: 0.3px solid var(--color-gray-400);
  display: flex;
  align-items: center;
  padding-right: 1rem;
  background-color: var(--color-gray-100);
  border-radius: 5px;
`;

const SearchInput = styled.input`
  border-style: none;
  padding-left: 1rem;
  background-color: transparent;
  position: relative;

  &:focus {
    outline: none;
  }
  @media (max-width: 458px) {
    width: 15rem;
  }
  @media (max-width: 398px) {
    width: 15rem;
  }
`;

const SearchButton = styled.button`
  background-color: ${({ primaryColor }) => primaryColor};
  padding: 0 1rem;
  height: 3.4rem;
  border-radius: 6px;
  border: none;
  color: var(--color-gray-100);
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

function UserListHeader({
  searchQuery,
  handleSearchChange,
  submit,
  pageDetail,
  btnDesc,
}) {
  const { primaryColor } = useTheme();
  return (
    <Header>
      <PageHeader>{pageDetail}</PageHeader>
      <Search>
        <InputContainer>
          <SearchInput
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search User"
          />
          <BiSearch size={'25px'} />
        </InputContainer>
        <SearchButton onClick={submit} primaryColor={primaryColor}>
          {btnDesc}
        </SearchButton>
      </Search>
    </Header>
  );
}

UserListHeader.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  handleSearchChange: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  pageDetail: PropTypes.string.isRequired,
  btnDesc: PropTypes.string.isRequired,
};

export default UserListHeader;
