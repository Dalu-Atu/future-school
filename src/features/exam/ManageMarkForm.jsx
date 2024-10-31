import { Input, Label } from '../../ui/Form';
import { useState } from 'react';
import { useEffect } from 'react';
// import { StyledMangeMarksForm } from '../../pages/Managexam';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledManageMarksForm = styled.div`
  // Your styles here
  margin-top: 1.5rem;
  margin-left: 1.5rem;
`;

function ManageMarkForm({ formData, sbjName, onInputChange }) {
  const subjectScore = formData?.[sbjName];

  const [firstText, setFirstText] = useState(subjectScore?.firstTest || 0);
  const [secondText, setSecondText] = useState(subjectScore?.secondTest || 0);
  const [exam, setExam] = useState(subjectScore?.exam || 0);
  const [gradeComment, setGradeComment] = useState('');

  const totalScore = +firstText + +secondText + +exam;

  useEffect(() => {
    setFirstText(subjectScore?.firstTest || 0);
    setSecondText(subjectScore?.secondTest || 0);
    setExam(subjectScore?.exam || 0);
  }, [subjectScore?.firstTest, subjectScore?.secondTest, subjectScore?.exam]);

  useEffect(() => {
    if (totalScore <= 30) setGradeComment('Poor');
    else if (totalScore > 30 && totalScore < 50) setGradeComment('Good');
    else if (totalScore >= 50 && totalScore < 70) setGradeComment('V.Good');
    else if (totalScore >= 70) setGradeComment('Excellent');
  }, [totalScore]);

  const handleGradeCommentChange = (e) => {
    setGradeComment(e.target.value);
  };

  return (
    <StyledManageMarksForm>
      <div>
        <Label>First Test</Label>
        <br />
        <Input
          value={firstText}
          onChange={(e) => {
            setFirstText(e.target.value);
            onInputChange(e);
          }}
          type="number"
          name="firstTest"
        />
      </div>
      <div>
        <Label>Second Test</Label>
        <br />
        <Input
          value={secondText}
          onChange={(e) => {
            setSecondText(e.target.value);
            onInputChange(e);
          }}
          type="number"
          name="secondTest"
        />
      </div>
      <div>
        <Label>Exam</Label>
        <br />
        <Input
          value={exam}
          onChange={(e) => {
            setExam(e.target.value);
            onInputChange(e);
          }}
          type="number"
          name="exam"
        />
      </div>
      <div>
        <Label>Total Score</Label>
        <br />
        <Input value={totalScore} type="number" readOnly name="totalScore" />
      </div>
      <div>
        <Label>Grade</Label>
        <br />
        <Input
          value={gradeComment}
          onChange={handleGradeCommentChange}
          name="grade"
        />
      </div>
    </StyledManageMarksForm>
  );
}

ManageMarkForm.propTypes = {
  formData: PropTypes.string.isRequired,
  sbjName: PropTypes.string.isRequired,
  onInputChange: PropTypes.string.isRequired,
};
export default ManageMarkForm;
