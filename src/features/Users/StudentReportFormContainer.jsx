import { useEffect, useState } from 'react';
import Button from '../../ui/Button';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { UpdateReports } from '../../services/managexam';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Spinner from '../../ui/Spinner';
import toast from 'react-hot-toast';
import { fetchStudents } from '../../services/schoolStudents';
import ScoreForm from '../../ui/ScoreForm';

const StyledManagexam = styled.div`
  height: calc(100vh - 58px);
  overflow-y: scroll;
  padding: 1.5rem;
`;

const ManageMarks = styled.div`
  width: 350px;
  margin-top: 0rem;
  border-radius: 5px;
  box-shadow: 0px 3px 5px var(--color-gray-200);
  padding-bottom: 4rem;

  /* width: 300px; */
  margin-left: auto;
  margin-right: auto;
  position: relative;
  overflow: hidden;
  margin-bottom: 4rem;
`;
const Profile = styled.div`
  height: 17rem;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0px 3px 5px var(--color-gray-400);
`;

const ProfilePhoto = styled.div`
  width: 8rem;
  height: 8rem;
  border: px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 50%;
  background-color: var(--color-gray-100);
  box-shadow: 0px 3px 5px var(--color-gray-200);
  margin-left: auto;
  margin-right: auto;
  position: relative;
  top: 2rem;
`;

const ProfileName = styled.div`
  text-align: center;
  position: relative;
  top: 3.5rem;
`;

const BtnContainer = styled.div`
  margin: 0rem 4rem 1rem 4rem;
  display: flex;
  justify-content: space-around;
  align-items: center;
`;
const SlideContainer = styled.div`
  width: 350px;
  flex-shrink: 0;
  margin-right: 10px;
  border-radius: 5px;
  padding: 10px;
  box-sizing: border-box;
`;

function ScoreFormContainer({ selectedClass }) {
  const [studentsData, setStudentsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  const {
    data: studentToBeScored,
    isLoading: isGettingStd,
    error,
  } = useQuery({
    queryKey: [selectedClass],
    queryFn: () => fetchStudents(selectedClass), //class_id
  });

  const { mutate: saveNewDataRecords, isPending: isSavingScores } = useMutation(
    {
      mutationFn: () => UpdateReports(studentsData, selectedClass),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [selectedClass],
        });
        toast.success('Records Successfully Added');
      },
      onError: (err) => toast.err(err.message),
    }
  );

  useEffect(() => {
    if (studentToBeScored) {
      const students = studentToBeScored.map((std) => {
        return { name: std.name, reports: std.reports, image: std.image };
      });
      setStudentsData(students);
    }
  }, [studentToBeScored]);

  const handleNext = () => {
    if (currentIndex < studentToBeScored.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      saveNewDataRecords();
    }
  };
  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleInputChange = (e, studentName) => {
    const { name, value } = e.target;
    let updatedStudentsData = [...studentsData];
    const index = updatedStudentsData.findIndex(
      (std) => std.name === studentName
    );

    // If a student with the same name is found, update its data
    if (index !== -1) {
      updatedStudentsData[index].reports[name] = value;
    }
    setStudentsData(updatedStudentsData);
  };

  if (isSavingScores) return <Spinner size="small" />;
  if (isGettingStd) return <Spinner size="small" />;
  if (studentToBeScored.length < 1)
    return (
      <div style={{ textAlign: 'center', padding: '10rem' }}>
        <h3>Ooops....</h3>
        <p>There is no student in this class</p>
      </div>
    );
  if (error) return toast.error(error.message);

  return (
    <>
      <StyledManagexam>
        <ManageMarks>
          <div
            style={{
              display: 'flex',
              transition: 'transform 0.5s ease',
              transform: `translateX(-${currentIndex * 360}px)`,
            }}
          >
            {studentsData?.map((student, index) => (
              <SlideContainer key={index}>
                <Profile>
                  <ProfilePhoto>
                    <img src={student.image} alt="" />
                  </ProfilePhoto>
                  <ProfileName>{student.name}</ProfileName>
                </Profile>
                <ScoreForm
                  formData={student}
                  onInputChange={(e) => handleInputChange(e, student.name)}
                />
              </SlideContainer>
            ))}
          </div>
          <BtnContainer>
            <Button onClick={handleBack}> Back</Button>
            <Button onClick={handleNext}>
              {currentIndex === studentToBeScored.length - 1 ? 'Save' : 'Next'}
            </Button>
          </BtnContainer>
        </ManageMarks>
      </StyledManagexam>
    </>
  );
}
ScoreFormContainer.propTypes = {
  selectedClass: PropTypes.string.isRequired,
  psycomotor: PropTypes.string.isRequired,
};
export default ScoreFormContainer;
