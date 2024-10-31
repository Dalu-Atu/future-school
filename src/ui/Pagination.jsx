import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useTheme } from '../services/ThemeContext';

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  position: relative;
  left: 1rem;
`;

const PageButton = styled.button`
  box-shadow: 0px 0px 5px gray;
  height: 3rem;
  width: 3rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  padding: 10px;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const PageNumber = styled.button`
  border: none;
  background: ${({ active }) => (active ? active : 'none')};
  color: ${({ active }) => (active ? 'white' : 'gray')};
  border-radius: ${({ active }) => (active ? '50%' : 'none')};
  cursor: pointer;
  padding: 10px;
  margin: 0 5px;
  height: 2rem;
  width: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1.5rem;
  margin-right: 1rem;
`;

const RowsPerPage = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
  position: relative;
  right: 3rem;

  select {
    margin-left: 5px;
    padding: 5px;
    border-radius: 5px;
    background-color: var(--color-gray-100);
  }
`;

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  rowsPerPage,
  onRowsChange,
}) => {
  const pageNumbers = [...Array(totalPages).keys()].map((i) => i + 1);
  const { primaryColor } = useTheme();
  return (
    <PaginationContainer>
      <PageButton
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </PageButton>

      {pageNumbers.map((pageNumber) => (
        <PageNumber
          key={pageNumber}
          active={pageNumber === currentPage ? primaryColor : false}
          onClick={() => onPageChange(pageNumber)}
        >
          {pageNumber}
        </PageNumber>
      ))}
      <PageButton
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </PageButton>

      <RowsPerPage>
        Show:
        <select
          value={rowsPerPage}
          onChange={(e) => onRowsChange(Number(e.target.value))}
        >
          <option value={7}>7 rows</option>
          <option value={14}>14 rows</option>
          <option value={21}>21 rows</option>
          <option value={50}>50 rows</option>
        </select>
      </RowsPerPage>
    </PaginationContainer>
  );
};
Pagination.propTypes = {
  totalPages: PropTypes.string.isRequired,
  currentPage: PropTypes.string.isRequired,
  onPageChange: PropTypes.string.isRequired,
  rowsPerPage: PropTypes.string.isRequired,
  onRowsChange: PropTypes.string.isRequired,
};
export default Pagination;
