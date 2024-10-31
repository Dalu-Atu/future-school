import styled from "styled-components";
import { Label, Select } from "../ui/Form";
import Button from "../ui/Button";
import { useState } from "react";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClassess } from "../services/schoolClasses";
import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";
import { getSubjectsInClass } from "../services/schoolsbj";
import { useLocation, useNavigate } from "react-router-dom";
import ShowForm from "../ui/ExamScoreForm";

const StyledManagexam = styled.div`
  height: calc(100vh - 60px);
  padding: 1.5rem;
`;
const StyledManagexamBody = styled.div`
  margin-top: 2rem;
  padding: 2em;

  box-shadow: 0px 3px 5px var(--color-gray-200);
  border-radius: 5px;
  height: max-content;
  display: grid;
  gap: 1.5rem;
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
  position: relative;
  left: -3.5rem;

  display: grid;
  gap: 0.7rem;
`;
function SelectionBox() {
  const [term, setTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState();
  const [selectedSubject, setSelectedSubject] = useState();
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  function manageStudentMarks() {
    navigate(`?class=${selectedClass}&subject=${selectedSubject}&term=${term}`);
  }

  const {
    isLoading: isGettingClasses,
    data: classes,
    error: classError,
  } = useQuery({
    queryKey: ["classes"],
    queryFn: getClassess,
  });

  const {
    data: subjectsData,
    isLoading: isGettingSubjects,
    error: subjectsError,
  } = useQuery({
    queryFn: () => getSubjectsInClass(selectedClass),
    queryKey: ["subjects", selectedClass],
    enabled: !!selectedClass,
  });

  useEffect(() => {
    if (subjectsData) {
      setSubjects(subjectsData);
    }
  }, [subjectsData]);

  if (isGettingClasses || isGettingSubjects) return <Spinner size="medium" />;
  if (classError || subjectsError)
    toast.error(classError?.message || subjectsError?.message);

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
            {classes?.map((cls) => (
              <option value={cls.name} key={cls.name}>
                {cls.name}
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
              <option value={subject.subject} key={subject.id}>
                {subject.subject}
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

function Managexam() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const selectedClass = params.get("class");
  const selectedSubject = params.get("subject");
  const selectedTerm = params.get("term");

  if (selectedClass && selectedSubject && selectedTerm) {
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
        <SelectionBox />
      </StyledManagexam>
    );
  }
}
export default Managexam;
