import styled from "styled-components";
import { Label, Select } from "../../ui/Form";
import Button from "../../ui/Button";
import { useState } from "react";
import { useEffect } from "react";
import PropTypes from "prop-types";
import { useLocation, useNavigate } from "react-router-dom";
import ShowForm from "../../ui/ExamScoreForm";
import { useAuth } from "../../services/AuthContext";

const PageHeader = styled.h3`
  margin: 1rem;
`;
const StyledManagexam = styled.div`
  margin: 0rem;
  /* background-color: var(--color-gray-100); */
  height: 100%;
  padding: 1.5rem;
`;
const StyledManagexamBody = styled.div`
  margin-top: 2rem;
  padding: 2em;
  /* background-color: var(--color-white); */
  box-shadow: 0px 3px 5px var(--color-gray-200);
  border-radius: 5px;
  height: max-content;
  display: grid;
  gap: 1.5rem;
  @media (max-width: 700px) {
    margin-top: -2rem;
    position: relative;
    left: -3rem;
  }
`;
export const StyledMangeMarksForm = styled.form`
  margin-left: auto;
  margin-right: auto;
  padding-top: 0.5rem;
  padding-bottom: 1rem;
  width: 40rem;
  padding-left: 5rem;
  padding-right: 5rem;
  padding-top: 2rem;

  display: grid;
  gap: 0.7rem;
`;

function SelectionBox() {
  const { user } = useAuth();
  const data = user.data;

  const teaches = data?.teaches || [];
  const accessClass = Object.keys(teaches);

  const [term, setTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  function manageStudentMarks() {
    navigate(`?class=${selectedClass}&subject=${selectedSubject}&term=${term}`);
  }

  useEffect(() => {
    if (selectedClass) {
      setSubjects(teaches[selectedClass]);
    }
  }, [selectedClass, teaches]);

  return (
    <>
      <StyledManagexamBody>
        <div>
          <Label>Select Class</Label>
          <Select
            defaultValue=""
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="" disabled>
              Select Class
            </option>
            {accessClass?.map((cls) => (
              <option value={cls} key={cls}>
                {cls}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label>Select Term</Label>
          <Select defaultValue="" onChange={(e) => setTerm(e.target.value)}>
            <option value="" disabled>
              Select Term
            </option>
            <option value="firstTerm">First Term</option>
            <option value="secondTerm">Second Term</option>
            <option value="thirdTerm">Third Term</option>
          </Select>
        </div>

        <div>
          <Label>Choose Subject</Label>
          <Select onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Choose Subject</option>
            {subjects?.map((subject) => (
              <option value={subject} key={subject}>
                {subject}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Button onClick={manageStudentMarks}>Manage marks</Button>
        </div>
      </StyledManagexamBody>
    </>
  );
}

const StudentForm = ({ studentName, formData, onInputChange }) => {
  return (
    <div>
      <h2>{studentName}</h2>
      <form>
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
          />
        </label>
        <label>
          Age:
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={onInputChange}
          />
        </label>
        <label>
          Grade:
          <input
            type="text"
            name="grade"
            value={formData.grade}
            onChange={onInputChange}
          />
        </label>
      </form>
    </div>
  );
};

function AddExamScores() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedClass = params.get("class");
  const selectedSubject = params.get("subject");
  const selectedTerm = params.get("term");

  if (selectedClass && selectedSubject) {
    return (
      <ShowForm
        selectedClass={selectedClass}
        selectedSubject={selectedSubject}
        selectedTerm={selectedTerm}
      />
    );
  } else {
    return (
      <StyledManagexam>
        <PageHeader>Manage Marks</PageHeader>
        <SelectionBox />
      </StyledManagexam>
    );
  }
}

StudentForm.propTypes = {
  studentName: PropTypes.string.isRequired,
  onInputChange: PropTypes.string.isRequired,
  formData: PropTypes.string.isRequired,
};
export default AddExamScores;
