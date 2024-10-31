import styled from 'styled-components';
import ScoreFormContainer from './StudentReportFormContainer';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import { getClassess } from '../services/schoolClasses';
import { Label, Select } from '../../ui/Form';
import Button from '../../ui/Button';
import PropTypes from 'prop-types';
import { useAuth } from '../../services/AuthContext';
import restriction from '../../assets/restriction.webp';

const StyledManagePscychomotor = styled.div`
  padding: 1rem;
  /* background-color: var(--color-gray-100); */
  /* height: 100%; */
`;

const StyledManagexamBody = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  /* background-color: var(--color-white);
  box-shadow: 0px 3px 5px var(--color-gray-200); */
  border-radius: 5px;
  height: max-content;
  display: grid;
  gap: 1.5rem;
  @media (max-width: 700px) {
    margin-top: 0rem;
    position: relative;
    left: -1rem;
  }
`;

const PageHeader = styled.h3`
  margin: 1rem;
`;

const StyledRestricted = styled.p`
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  margin-top: 5rem;
  color: gray;
  padding-left: 5rem;
  padding-right: 5rem;
`;

const RestrictedImg = styled.img`
  width: 30rem;
  height: auto;
  margin-left: auto;
  margin-right: auto;
`;
// HAVE A FIELD THAT SETS FORM TEACHER TO TRUE. ONLY FORM TEACHHERS CAN DO THIS PART

// isFormteacher: jss1
// if (isFormTeacherIsFalse) return <Only form Teachers can add Repots
// const accessClass = isFormteacher; which is the class

function SelectionBox() {
  const { user } = useAuth();
  const data = user.data;
  const [selectedClass, setSelectedClass] = useState(data.isFormTeacher);
  const navigate = useNavigate();

  function viewStudentReport() {
    navigate(`?class=${selectedClass}`);
  }
  return (
    <>
      <StyledManagexamBody>
        <div>
          <Label>Select Class</Label>
          <Select defaultValue="">
            <option value="" disabled>
              Select Class
            </option>
            {selectedClass?.map((cls) => (
              <option value={cls} key={cls}>
                {cls}
              </option>
            ))}
          </Select>
        </div>
        <div></div>
        <div>
          <Button onClick={viewStudentReport}>Manage Report</Button>
        </div>
      </StyledManagexamBody>
    </>
  );
}

export function Restricted({ status }) {
  return (
    <StyledRestricted>
      <RestrictedImg src={restriction} />
      <p> {status}</p>
    </StyledRestricted>
  );
}

function AddStudentreport() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const selectedClass = params.get('class');
  const { user } = useAuth();
  const data = user.data;

  if (!data.isFormTeacher)
    return (
      <Restricted status={'Only form teachers can update studets reports!'} />
    );

  if (selectedClass)
    return <ScoreFormContainer selectedClass={selectedClass} />;

  return (
    <StyledManagePscychomotor>
      <PageHeader>Manage Report</PageHeader>
      <SelectionBox />
    </StyledManagePscychomotor>
  );
}

Restricted.propTypes = {
  status: PropTypes.string.isRequired,
};

export default AddStudentreport;
