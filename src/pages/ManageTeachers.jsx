import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  admitUser,
  deleteUser,
  getAllTeachers,
  updateUser,
} from '../services/teachersService';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';
import Modal from '../ui/Modal';
import styled from 'styled-components';
import UserCard from '../ui/UserCard';
import NewForm, { InputBox, SelectBox } from '../ui/NewForm';
import UserListHeader from '../ui/UserListHeader';
import Pagination from '../ui/Pagination';
import { useTheme } from '../services/ThemeContext';

const StyledManageTeachers = styled.div`
  /* background-color: var(--color-gray-100); */
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
  color: var(--color-gray-500);
  /* border: 5px solid rebeccapurple; */
`;
export const StyledContainer = styled.div`
  /* border: 2px solid rebeccapurple; */

  overflow: hidden;
  width: calc(100vw - 30%);
  margin: 0;
  padding: 0;
  @media (max-width: 1128px) {
    width: calc(100vw - 0%);
  }
  @media (max-width: 832px) {
    width: calc(100vw + 1%);
  }
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

const PageHeader = styled.h3`
  margin: 1rem;
`;
const UserContainer = styled.div`
  max-height: calc(100vh - 30rem);
  overflow: hidden;
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

function ManageTeachers() {
  const cartegory = 'teachers';
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7); // Set default to 7 rows per page
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { register, handleSubmit, setValue, reset } = useForm();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isEdit, setIsEdit] = useState(false);
  const { primaryColor } = useTheme();
  const queryClient = useQueryClient();

  useEffect(() => {
    const nameParts = name.split(' ');
    setUserName(`${nameParts[0]?.toLowerCase()}`);
    setPassword(nameParts[0]?.toLowerCase());
    setValue('username', userName);
    setValue('password', password);
  }, [name, setValue, userName, password]);

  const { isLoading: loadTeacher, data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: getAllTeachers,
  });

  const { mutate: addTeacher, isPending: isAdding } = useMutation({
    mutationFn: admitUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teachers'],
      });
      setShowForm(false);
      reset();
      toast.success('Teacher Admitted');
    },
    onError: (error) => toast.error(error.message),
  });

  const { mutate: updateTeacherData, isPending: isUpdating } = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      toast.success('Teacher successfully updated');
      queryClient.invalidateQueries({
        queryKey: ['teachers'],
      });
      setShowForm(false);
    },
    onError: (err) => toast.error(err.message),
  });

  const { mutate: remove, isPending: isRemoving } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teachers'],
      });
      setShowForm((showForm) => false);
      toast.success('Teacher Deleted Successfully');
    },
    onError: (error) => toast.error(error.message),
  });

  function toggleForm(e) {
    setIsEdit(false);
    e.preventDefault();
    reset({
      name: setName(''),
      gender: 'male',
      section: 'pcSubject',
      username: '',
      password: '',
    });
    setShowForm(!showForm);
  }

  function clearForm(e) {
    // e.preventDefault();

    setShowForm(false);
    setIsEdit(false);
    reset({
      name: setName(''),
      gender: 'male',
      section: 'pc',
      username: '',
      password: '',
    });

    // Instead of alerting directly, use useEffect to alert after the state has updated
  }
  function submitForm(data) {
    if (isEdit)
      return updateTeacherData({ data: [selectedTeacher, data], cartegory });
    data.name = data.name.toUpperCase();
    addTeacher({ data, cartegory: 'teachers' });
    clearForm();
  }

  function handleTeacherClick(teacher) {
    setIsEdit(true);

    reset({
      name: setName(teacher.name),
      gender: teacher.gender,
      section: teacher.section,
      username: teacher.username,
      password: teacher.password,
      phone: teacher.phone,
    });

    setSelectedTeacher(teacher);
    setShowForm((showForm) => true);
  }
  const totalItems = teachers?.length || 0;
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

  const sortedData = teachers
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

  if (loadTeacher || isAdding || isRemoving || isUpdating)
    return <Spinner size="medium" />;

  return (
    <StyledManageTeachers>
      <PageHeader>Manage Teachers</PageHeader>
      <StyledContainer>
        <UserListHeader
          pageDetail="  All Teachers"
          searchQuery={searchQuery}
          handleSearchChange={handleSearchChange}
          submit={toggleForm}
          btnDesc="Admit Teacher"
        />
        <UsersInfo bg={primaryColor}>
          <p>Name</p>
          <p>Username</p>
          <p>Gender</p>
          <p>Section</p>
          <p>Action</p>
        </UsersInfo>
        <UserContainer>
          {paginatedData?.map((teacher) => (
            <UserCard
              handleEdit={handleTeacherClick}
              handleDelete={{
                remove: remove,
                info: { userToDelete: teacher, cartegory },
              }}
              onClick={handleTeacherClick}
              id={teacher}
              key={teacher.id}
              name={teacher.name}
              image={teacher.image}
              label={
                teacher.assignClass ? teacher.assignClass : teacher.subjects
              }
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
          <NewForm
            formName={isEdit ? 'Update Teacher' : 'Admit New Teacher'}
            onSubmit={handleSubmit(submitForm)}
            action={isEdit ? 'Update Teacher' : 'Admit Teacher'}
          >
            <InputBox
              {...register('name')}
              onChange={(e) => setName(e.target.value)}
              defaultValue={name}
              label="Full Name"
            />
            <SelectBox label="Gender" {...register('gender')}>
              <option value={'male'}>Male</option>
              <option value={'female'}>Female</option>
            </SelectBox>
            {/* <InputColumn> */}
            <InputBox {...register('phone')} label="Phone Number" />
            <SelectBox
              label="Section"
              {...register('section', { required: true })}
            >
              <option value="pc">PC</option>
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
            </SelectBox>
            {/* </InputColumn> */}

            {/* <InputColumn>
              <InputBox value={userName} label="username" />
              <InputBox value={password} label="password" />
            </InputColumn> */}
          </NewForm>
        </Modal>
      )}
    </StyledManageTeachers>
  );
}

export default ManageTeachers;
