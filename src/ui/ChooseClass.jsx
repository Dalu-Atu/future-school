import { useQuery } from "@tanstack/react-query";
import { getClassess } from "../services/schoolClasses";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { sortClasses } from "../utils/sortData";
import { SelectionForm } from "./NewForm";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledSelect = styled.select`
  padding-left: 1rem;
  width: 25rem;
  border-radius: 5px;
  height: 3.5rem;
  background-color: var(--color-gray-300);
  color: var(--color-gray-600);

  @media (max-width: 800px) {
  }

  @media (max-width: 600px) {
  }

  @media (max-width: 430px) {
    width: 20rem;
  }
  @media (max-width: 366px) {
    width: 15rem;
  }
`;

function ChooseClass({ redirectRoute, btnLabel }) {
  const { isLoading, data, error } = useQuery({
    queryKey: ["classes"],
    queryFn: getClassess,
  });

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const navigate = useNavigate();

  if (isLoading) return <Spinner size="medium" />;
  if (error) return <div>Error fetching data</div>;

  const classes = data ? sortClasses(data) : [];

  function handleSubmit() {
    navigate(`/${redirectRoute}?class=${selectedClass}&term=${selectedTerm}`);
  }

  return (
    <SelectionForm btn={btnLabel} submit={handleSubmit}>
      <StyledSelect onChange={(e) => setSelectedClass(e.target.value)}>
        <option value="">Choose class</option>
        {classes.map((cls) => (
          <option key={cls.id} value={cls.name}>
            {cls.name}
          </option>
        ))}
      </StyledSelect>
      <StyledSelect onChange={(e) => setSelectedTerm(e.target.value)}>
        <option value="">Choose Term</option>
        <option value={"firstTerm"}>First Term</option>
        <option value={"secondTerm"}>Second Term</option>
        <option value={"thirdTerm"}>Third Term</option>
      </StyledSelect>
    </SelectionForm>
  );
}

ChooseClass.propTypes = {
  redirectRoute: PropTypes.string.isRequired,
  btnLabel: PropTypes.string.isRequired,
};
export default ChooseClass;
