import { useParams } from "react-router-dom";

import styled from "styled-components";
import { fetchStudents } from "../services/schoolStudents";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useEffect, useState } from "react";

import Spinner from "../ui/Spinner";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { admitUser, deleteUser, updateUser } from "../services/teachersService";
import { StyledContainer } from "./ManageTeachers";
import Modal from "../ui/Modal";
import NewForm, { InputBox, InputColumn, SelectBox } from "../ui/NewForm";
import UserCard from "../ui/UserCard";
import UserListHeader from "../ui/UserListHeader";
import Pagination from "../ui/Pagination";
import { useTheme } from "../services/ThemeContext";

const StyledManageStudents = styled.div`
  height: calc(100vh - 58px);
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
const StyledManagementHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem;
  font-weight: 600;
  color: var(--color-gray-500);
`;
const UsersInfo = styled.div`
  font-weight: 700;
  margin: 0.4rem 2rem 0 2rem;
  background-color: ${(props) => props.bg};
  border-radius: 3px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  align-items: center;
  text-align: center;
  padding-right: 5px;
  color: var(--color-gray-100);

  @media (max-width: 1130px) {
    margin: 1.3rem 2rem 1rem 0rem;
  }
  @media (max-width: 800px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    & > p:nth-child(2) {
      // Hides Username
      display: none;
    }
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr 1fr 1fr;
    & > p:nth-child(3) {
      // Hides Gender
      display: none;
    }
  }

  @media (max-width: 400px) {
    grid-template-columns: 1fr 1fr;
    & > p:nth-child(4) {
      // Hides Section
      display: none;
    }
  }
`;

const Name = styled.p`
  border: 1px solid gray;
  padding: 5px 10px 5px 15px;
  border-radius: 10px;

  @media (max-width: 600px) {
    display: none;
    visibility: hidden;
  }
`;
const UserContainer = styled.div`
  max-height: calc(100vh - 30rem);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0; /* Remove scrollbar space */
    background: transparent; /* Optional: Just make scrollbar invisible */
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none; /* For Firefox */

  /* Hide scrollbar for IE and Edge */
  -ms-overflow-style: none; /* IE and Edge */
`;
const PageHeader = styled.h3`
  margin: 1rem;
`;

function ManageStudents() {
  const cartegory = "students";
  const { primaryColor } = useTheme();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7); // Set default to 7 rows per page
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const { register, handleSubmit, setValue, reset } = useForm();
  const [isEdit, setIsEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const queryClient = useQueryClient();
  function generateSerialNumber() {
    // Generates a serial number in the format SN-XXXX-XXXX-XXXX
    const prefix = "SN-";
    let serial = prefix;
    for (let i = 0; i < 3; i++) {
      const segment = Math.random().toString(36).substring(2, 6).toUpperCase(); // Generate 4 random alphanumeric characters
      serial += segment;
      if (i < 2) serial += "-"; // Add dash after the first two segments
    }
    return serial;
  }
  function generatePIN() {
    // Generates a numeric PIN of length 10
    let pin = "";
    for (let i = 0; i < 10; i++) {
      pin += Math.floor(Math.random() * 10); // Generate a random digit (0-9)
    }
    return pin;
  }
  function handleGeneratPass() {
    const serialNumber = generateSerialNumber();
    const pin = generatePIN();

    setValue("pin", pin);
    setValue("serialNumber", serialNumber);
  }

  // Example usage

  useEffect(() => {
    const nameParts = name.split(" ");
    setUserName(`${nameParts[0]?.toLowerCase()}`);
    setPassword(nameParts[0]?.toLowerCase());
    setValue("username", userName);
    setValue("password", password);
    setValue("cartegory", cartegory);

    setValue("class_id", id);
  }, [name, setValue, userName, password, id]);

  const {
    data: students,
    isLoading: isGettingStudents,
    error,
  } = useQuery({
    queryKey: ["students", id],
    queryFn: () => fetchStudents(id),
  });

  const { mutate: admitingStudent, isPending: isAdmittingStudent } =
    useMutation({
      mutationFn: admitUser,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["students"],
        });
        toast.success("Student successfully admited");
        setShowForm(false);
      },
      onError: (err) => toast.error(err.message),
    });

  const { mutate: updatingStudent, isPending: isUpdatingStudent } = useMutation(
    {
      mutationFn: updateUser,
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["students"],
        });
        toast.success("student successfully updated");
        queryClient.invalidateQueries({
          queryKey: ["students"],
        });
        setShowForm(false);
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const { mutate: removeStudent, isPending: isRemovingntStudet } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["students"],
      });
      setShowForm((showForm) => false);
      toast.success("Student Deleted");
    },
    onError: (error) => toast.error(error.message),
  });

  // const numbOfStudents = students?.length;
  const toggleForm = () => {
    setShowForm(true);
  };

  function clearForm() {
    setShowForm(false);
    setIsEdit(false);
    reset({
      name: setName(""),
      username: "",
      password: "",
    });
  }

  function submitForm(data) {
    if (isEdit)
      return updatingStudent({ data: [selectedStudent, data], cartegory });
    data.name = data.name.toUpperCase();
    admitingStudent({ data, cartegory: "students" });
  }

  function handleStudentClick(student) {
    setIsEdit(true);

    reset({
      name: setName(student.name),
      gender: student.gender,
      section: student.section,
      class_id: student.class_id,
      username: student.username,
      password: student.password,
      birthDate: student.birthDate,
      pin: student.pin,
      serialNumber: student.serialNumber,
    });

    setSelectedStudent(student);
    setShowForm(true);
  }
  const totalItems = students?.length || 0;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsChange = (rows) => {
    setRowsPerPage(rows);
    setCurrentPage(1); // Reset to first page when rows per page changes
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page when search query changes
  };

  const sortedData = students
    ?.slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  // Filter the data based on the search query
  const filteredData = sortedData?.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic to slice the data based on current page and rowsPerPage
  const paginatedData = filteredData?.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  if (
    isGettingStudents ||
    isAdmittingStudent ||
    isUpdatingStudent ||
    isRemovingntStudet
  )
    return <Spinner size="medium" />;
  if (error) return toast.error(error.message);

  return (
    <StyledManageStudents>
      <StyledManagementHeader>
        <PageHeader>Manage Students</PageHeader>
        <p>{id}</p>
        <Name>{"All Students"}</Name>
      </StyledManagementHeader>
      <StyledContainer>
        <UserListHeader
          pageDetail={`All Students : ${students.length}`}
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          submit={toggleForm}
          btnDesc="Admit Student"
        />

        <UsersInfo bg={primaryColor}>
          <p>Name</p>
          <p>Username</p>
          <p>Gender</p>
          <p>Section</p>
          <p>Action</p>
        </UsersInfo>
        <UserContainer>
          {paginatedData.map((std) => (
            <UserCard
              id={std}
              name={std.name.toUpperCase()}
              label={"Student"}
              key={std.id}
              handleEdit={handleStudentClick}
              handleDelete={{
                remove: removeStudent,
                info: { userToDelete: std, cartegory },
              }}
            />
          ))}
        </UserContainer>

        <Pagination
          totalPages={Math.ceil(filteredData.length / rowsPerPage)}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsChange={handleRowsChange}
        />
      </StyledContainer>

      {showForm && (
        <Modal onClose={clearForm}>
          {
            <NewForm
              formName={isEdit ? "Update Student" : "Admit New Student"}
              onSubmit={handleSubmit(submitForm)}
              action={isEdit ? "Update Student" : "Admit Student"}
            >
              <InputBox
                {...register("name", { required: true })}
                onChange={(e) => setName(e.target.value)}
                defaultValue={name}
                label="Full Name"
              />

              <SelectBox
                label="Gender"
                {...register("gender", { required: true })}
              >
                <option value={"male"}>Male</option>
                <option value={"female"}>Female</option>
              </SelectBox>

              <InputBox
                {...register("birthDate", { required: false })}
                label="Date of Birth"
              />
              <SelectBox
                label="Section"
                {...register("section", { required: true })}
              >
                <option value="pc">PC</option>
                <option value="primary">Primary</option>
                <option value="secondary">Secondary</option>
              </SelectBox>
              <InputColumn>
                <InputBox label="Pin" {...register("pin")}></InputBox>

                <InputBox
                  label="Serial No"
                  {...register("serialNumber")}
                ></InputBox>
                <button type="button" onClick={handleGeneratPass}>
                  Generate
                </button>
              </InputColumn>
            </NewForm>
          }
        </Modal>
      )}
    </StyledManageStudents>
  );
}

export default ManageStudents;
