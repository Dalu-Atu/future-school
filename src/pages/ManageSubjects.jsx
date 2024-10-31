import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Button from "../ui/Button";
import { getSubjectsInClass } from "../services/schoolsbj";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";

import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getAllTeachers } from "../services/teachersService";

import {
  useAddSubject,
  useRemoveSubject,
  useUpdateSubject,
} from "../hooks/subjectHooks";
import Modal, { Notification } from "../ui/Modal";
import NewForm, { InputBox, SelectBox } from "../ui/NewForm";
import { useTheme } from "../services/ThemeContext";

const StyledContainer = styled.div`
  /* position: relative;
  left: -1rem; */
  /* border: 2px solid black; */
  overflow: hidden;

  max-height: calc(100vh - 170px);
  width: calc(100vw - 30%);
  margin-left: auto;
  margin-right: auto;
  padding: 0.5rem;
  margin-top: 1rem;
  @media (max-width: 1130px) {
    width: 100vw;
    position: relative;
    left: -1rem;
  }
`;

const StyledManageSubjects = styled.div`
  height: calc(100vh - 50px);
  padding: 1rem;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px 0px 10px;
  color: var(--color-gray-800);

  margin-top: 1rem;
`;
const PageName = styled.p`
  font-weight: bold;
  font-size: 25px;
  display: flex;
  align-items: center;
  padding: 0px 10px 0px 10px;
  gap: 1rem;
  color: var(--color-gray-500);
  @media (max-width: 456px) {
    font-size: 18px;
    position: relative;
    left: -1rem;
  }
`;
const ListsProperties = styled.div`
  text-align: center;
  margin-top: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 15%;
  margin-top: 3rem;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  align-items: center;
  padding-left: 10px;
  color: var(--color-white);
  background-color: ${({ bg }) => bg};
  font-weight: 600;
  word-spacing: 5px;
  border-radius: 3px;
  overflow: hidden;

  @media (max-width: 520px) {
    grid-template-columns: 0.4fr 0.4fr 1fr 15%;
    & > *:nth-child(4) {
      display: none;
    }
  }
  @media (max-width: 512px) {
    grid-template-columns: 0.4fr 2fr 1fr;
    & > *:nth-child(1) {
      display: none;
    }
  }
`;

const Subject = styled.div`
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 15%;
  margin-left: 1.5rem;
  margin-right: 1.5rem;
  align-items: center;
  padding-left: 10px;
  margin-top: 2rem;
  background-color: var(--color-gray-300);
  padding: 7px;
  border-radius: 5px;
  box-shadow: 1px 1px 1px var(--color-gray-300);
  text-align: center;
  @media (max-width: 520px) {
    grid-template-columns: 0.4fr 0.4fr 1fr 15%;
    & > *:nth-child(4) {
      display: none;
    }
  }
  @media (max-width: 512px) {
    grid-template-columns: 0.4fr 2fr 0.6fr;
    & > *:nth-child(1) {
      display: none;
    }
  }
`;
const Total = styled.p`
  color: var(--color-gray-400);
  position: relative;
  top: 2rem;
  text-align: center;
  word-spacing: 3px;
`;

const SubjectDetailcontainer = styled.div`
  overflow: hidden;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: Just make scrollbar invisible */
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none; /* For Firefox */
  max-height: calc(100vh - 280px);
`;

function ClassSubject({
  subjectName,
  subjectTeacher,
  isFormTeacher,
  handleCLick,
  handleDelete,
  sbj,
}) {
  const { id } = useParams();
  const [action, setConfirmAction] = useState(false);

  if (action)
    return (
      <Notification
        message="Are you sure you want to delete this subject"
        takeAction={handleDelete}
        revokeAction={setConfirmAction}
      />
    );

  return (
    <Subject>
      <p>{id}</p>
      <p>{subjectName}</p>
      <p>{subjectTeacher}</p>
      <p>{isFormTeacher}</p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          top: "0rem",
          width: "8rem",
        }}
      >
        <button onClick={() => handleCLick(sbj)} style={{ color: "#44a08d" }}>
          Edit
        </button>
        <button
          onClick={() => setConfirmAction(true)}
          style={{ color: "orangered" }}
        >
          Delete
        </button>
      </div>
    </Subject>
  );
}

function ManageSubjects() {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { updatingSubject } = useUpdateSubject(id);
  const { addSubject } = useAddSubject(id);
  const { removeSubject } = useRemoveSubject(id);
  const { primaryColor } = useTheme();

  const {
    data: subjects,
    isLoading: isGettingSubjects,
    error,
  } = useQuery({
    queryFn: () => getSubjectsInClass(id),
    queryKey: ["subjects", id],
  });

  const {
    data: classTeachers,
    isLoading: isGettingTeachers,
    error: iserrorGettingTeacher,
  } = useQuery({
    queryFn: getAllTeachers,
    queryKey: ["teachers"],
  });

  const toggleForm = () => setShowForm((form) => !form);

  function clearForm() {
    setIsEdit(false);
    reset({ subjectTeacher: "", subjectName: "" });
    setShowForm((form) => !form);
    setSelectedSubject(null);
  }

  async function submitForm(subjectToAssign) {
    clearForm();
    if (isEdit) {
      try {
        setLoading(true);
        await updatingSubject({ subjectToAssign, selectedSubject });
      } catch (error) {
        console.error("Error updating data:", error);
      } finally {
        setLoading(false); // Set loading to false when fetching ends (whether successful or not)
      }
      return;
    }

    try {
      setLoading(true);
      await addSubject(subjectToAssign); // Await the addAsignSubject call to handle it asynchronously
      // Any other code you want to execute after fetching data
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false); // Set loading to false when fetching ends (whether successful or not)
    }
  }

  function editSubject(subject) {
    setIsEdit(true);
    setSelectedSubject(subject);

    reset({
      subjectName: subject.subject,
      subjectTeacher: subject.name,
    });

    setShowForm((showForm) => true);
  }

  async function deleteSubject(subject) {
    try {
      setLoading(true);
      await removeSubject(subject || null);
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  }

  if (isGettingSubjects) return <Spinner size="medium" />;
  if (isGettingTeachers) return <Spinner size="medium" />;
  if (loading) return <Spinner size="medium" />;
  if (iserrorGettingTeacher) return toast.error(iserrorGettingTeacher.message);
  if (error) return toast.error(error.message);
  console.log(subjects);

  return (
    <>
      <StyledManageSubjects>
        <Header>
          <PageName>Manage Subjects</PageName>
          <Button onClick={toggleForm}>Add Subject</Button>
        </Header>
        <StyledContainer>
          <ListsProperties bg={primaryColor}>
            <p>Class</p>
            <p>Subject</p>
            <p>Teacher</p>
            <p>Form teacher</p>
            <p>Action</p>
          </ListsProperties>
          <SubjectDetailcontainer>
            {subjects?.map((sbj) => (
              <ClassSubject
                subjectName={sbj.subject}
                subjectTeacher={sbj.name}
                key={sbj.name}
                handleCLick={editSubject}
                sbj={sbj}
                isFormTeacher={sbj.isFormTeacher}
                handleDelete={{
                  remove: deleteSubject,
                  info: sbj,
                }}
              />
            ))}
          </SubjectDetailcontainer>
        </StyledContainer>
        <Total>
          <b>{subjects.length}</b> Subjects in total
        </Total>
      </StyledManageSubjects>
      {showForm && (
        <Modal onClose={clearForm}>
          <NewForm
            formName={isEdit ? "Update Subject" : "Add Class Subject"}
            onSubmit={handleSubmit(submitForm)}
            action={isEdit ? "Update Subject" : "Add Subject"}
          >
            <InputBox {...register("subjectName")} label="Name of Subject" />
            <SelectBox label="Class" {...register("className")}>
              <option value={id}>{id}</option>
            </SelectBox>
            <SelectBox label="Assigned Teacher" {...register("subjectTeacher")}>
              {classTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.name}>
                  {teacher.name}
                </option>
              ))}
            </SelectBox>
            <SelectBox label="Form Teacher?" {...register("isFormTeacher")}>
              <option value="no">no</option>
              <option value="yes">Yes</option>
            </SelectBox>
          </NewForm>
        </Modal>
      )}
    </>
  );
}
ClassSubject.propTypes = {
  subjectName: PropTypes.string.isRequired,
  subjectTeacher: PropTypes.string.isRequired,
  handleCLick: PropTypes.string.isRequired,
  sbj: PropTypes.string.isRequired,
  isFormTeacher: PropTypes.string.isRequired,
  handleDelete: PropTypes.string.isRequired,
};

export default ManageSubjects;
// add sbj, choose subjects,  from list of teachers, choose teachers. then after save
// the chosen teacher should have an array {[pc2 ict, ], [pc3: '']}

// add sbg name, add tch to sbg [pc2. l]
// add sbj name add tch to sbg [pc2 n]
