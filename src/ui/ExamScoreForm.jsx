import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import styled from "styled-components";
import PropTypes from "prop-types";
import ManageMarkForm from "../features/exam/ManageMarkForm";
import {
  ManageClassAndSubjectScores,
  UpdateMarks,
} from "../services/managexam";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Spinner from "./Spinner";
import SpinnerMini from "./SpinnerMini";

import toast from "react-hot-toast";

const StyledManagexam = styled.div`
  overflow-y: scroll;
  height: calc(100vh - 60px);
  padding: 1.5rem;
  @media (max-width: 700px) {
    padding: 0rem;
    margin-top: 1rem;
  }
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media (max-width: 700px) {
    margin-top: 2rem;
    padding-left: 3rem;
    padding-right: 3rem;
  }
`;

const ManageMarks = styled.div`
  width: 350px;
  border-radius: 5px;
  /* background-color: white;
  box-shadow: 0px 3px 5px var(--color-gray-200); */
  padding-bottom: 6rem;
  /* border: 2px solid black; */
  margin-left: auto;
  margin-right: auto;
  overflow: hidden;
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

function ExamScoreForm({ selectedClass, selectedSubject, selectedTerm }) {
  const navigate = useNavigate();
  const [studentsData, setStudentsData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const queryClient = useQueryClient();

  const {
    data: studentToBeScored,
    isLoading: isGettingStd,
    error,
  } = useQuery({
    queryKey: [selectedClass, selectedSubject],
    queryFn: () =>
      ManageClassAndSubjectScores(selectedClass, selectedSubject, selectedTerm),
  });

  const { mutate: saveStudentScores, isPending: isSavingScores } = useMutation({
    mutationFn: () =>
      UpdateMarks(studentsData, selectedSubject, selectedClass, selectedTerm),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [selectedClass, selectedSubject],
      });
      toast.success("Scores Successfully Added");
      navigate(-1);
    },
    onError: (err) => toast.err(err.message),
  });

  useEffect(() => {
    if (studentToBeScored) {
      setStudentsData(studentToBeScored);
    }
  }, [studentToBeScored]);

  const handleNext = () => {
    if (currentIndex < studentToBeScored.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      saveStudentScores();
    }
  };
  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleInputChange = (e, student) => {
    const { name, value } = e.target;
    let updatedStudentsData = [...studentsData]; // Create a copy of the original array

    // Find the index of the student with the same name in the array

    const index = updatedStudentsData.findIndex((std) => std.name === student);

    // If a student with the same name is found, update its data
    if (index !== -1) {
      if (!updatedStudentsData[index][selectedSubject])
        return (updatedStudentsData[index][selectedSubject] = {
          exam: 0,
          firstTest: 0,
          secondTest: 0,
        });
      updatedStudentsData[index][selectedSubject][name] = +value;
    }
    setStudentsData(updatedStudentsData);
  };

  if (isGettingStd) return <Spinner size="medium" />;
  if (error) return toast.error(error.message);

  return (
    <>
      <StyledManagexam>
        <PageHeader>
          <p>Manage Marks</p>
          <p>{selectedSubject}</p>
          <p>{selectedClass}</p>
        </PageHeader>
        <ManageMarks>
          <div
            style={{
              display: "flex",
              transition: "transform 0.5s ease",
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
                <ManageMarkForm
                  formData={student}
                  sbjName={selectedSubject}
                  onInputChange={(e) => handleInputChange(e, student.name)}
                />
              </SlideContainer>
            ))}
          </div>
          <BtnContainer>
            <Button onClick={handleBack}> Back</Button>
            <Button onClick={handleNext} disabled={isSavingScores}>
              {isSavingScores ? (
                <>
                  <SpinnerMini />
                  <span style={{ marginLeft: "5px" }}>Saving...</span>
                </>
              ) : currentIndex === studentToBeScored.length - 1 ? (
                "Save"
              ) : (
                "Next"
              )}
            </Button>
          </BtnContainer>
        </ManageMarks>
      </StyledManagexam>
    </>
  );
}
ExamScoreForm.propTypes = {
  selectedClass: PropTypes.string.isRequired,
  selectedSubject: PropTypes.string.isRequired,
};
export default ExamScoreForm;
