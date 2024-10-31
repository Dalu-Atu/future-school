import PropTypes from 'prop-types';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import BackButton from './BackButton';
import { useQuery } from '@tanstack/react-query';
import { HiMiniPlusCircle } from 'react-icons/hi2';
import {
  getClassess,
  useAddClass,
  useDeleteClass,
  useUpdateClass,
} from '../services/schoolClasses';
import { Link } from 'react-router-dom';
import Spinner from './Spinner';
import { sortClasses } from '../utils/sortData';
import { useState } from 'react';
import Modal, { Notification } from './Modal';
import { useForm } from 'react-hook-form';
import NewForm, { InputBox, InputColumn, SelectBox } from './NewForm';
import { useTheme } from '../services/ThemeContext';
import SpinnerOrdinary from './SpinnerOrdinary.';

const StyledClassList = styled.div`
  margin: 1.5rem;
  height: 65rem;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 0;
  }

  /* Hide scrollbar for Firefox */
  scrollbar-width: none; /* For Firefox */

  /* Hide scrollbar for IE and Edge */

  padding-bottom: 2rem;
  /* color: var(--color-gray-800);
  background-color: var(--color-white); */
`;

const StyledNav = styled.div`
  margin-top: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  /* position: sticky; */
`;
const StyledClass = styled(Link)`
  margin-top: 1.5rem;
  color: var(--color-gray-600);
  padding: 0.5rem;
  border-radius: 5px;
  display: flex;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  box-shadow: -3px 3px 5px var(--color-gray-200),
    3px 3px 5px var(--color-gray-300);
  display: flex;
  justify-content: space-between;
  overflow: hidden;
`;

function MiniNav() {
  const [addClass, setAddClass] = useState(false);
  const { primaryColor } = useTheme();

  if (addClass) return <AddClassForm setAddClass={setAddClass} />;
  return (
    <StyledNav>
      <StyledNav>
        <p onClick={() => setAddClass((addClass) => !addClass)}>
          <span
            style={{
              cursor: 'pointer',
              position: 'relative',
              marginLeft: '1rem',
              left: '-0.5rem',
              top: '0.2rem',
            }}
          >
            <HiMiniPlusCircle
              style={{
                color: primaryColor,
                position: 'relative',
                top: '0.3rem',
                right: '0.5rem',
              }}
            />
            Add class
          </span>
        </p>
      </StyledNav>
      <BackButton />
    </StyledNav>
  );
}

function ClassList({ specifiedRoute }) {
  let navigateto;
  const [showForm, setShowForm] = useState(null);
  const [prompt, setPrompt] = useState(null);
  const { deletingClass, isDeleting } = useDeleteClass();
  const { updatingClass, isUpdating } = useUpdateClass();
  const { isLoading, data, error } = useQuery({
    queryKey: ['classess'],
    queryFn: getClassess,
  });

  let dataToBeUpdate;
  if (showForm) dataToBeUpdate = { ...showForm, updatingClass, setShowForm };

  if (showForm) return <AddClassForm updateClass={dataToBeUpdate} />;

  if (specifiedRoute === 'student') navigateto = '/managestudents/';
  if (specifiedRoute === 'class') navigateto = '/dashboard/manageclass';
  if (specifiedRoute === 'subject') navigateto = '/managesubjects/';

  if (isLoading || isDeleting || isUpdating) return <SpinnerOrdinary />;
  if (error) return toast.error(error.message);

  if (prompt)
    return (
      <Notification
        takeAction={{ remove: deletingClass, info: prompt }}
        revokeAction={setPrompt}
        message={`Are you sure you want to delete this ${prompt} class`}
      />
    );
  const classes = sortClasses(data);
  if (specifiedRoute === 'class')
    return (
      <StyledClassList>
        <MiniNav />
        {classes.map((cls) => (
          <StyledClass key={cls.id}>
            <p>{cls.name}</p>{' '}
            <div
              style={{
                display: 'flex',
                width: '6.5rem',
                justifyContent: 'space-between',
                fontSize: 'small',
              }}
            >
              <p onClick={() => setShowForm(cls)} style={{ color: '#44a08d' }}>
                Edit
              </p>{' '}
              <p
                onClick={() => setPrompt(cls.name)}
                style={{ color: 'orangered' }}
              >
                Delete
              </p>
            </div>
          </StyledClass>
        ))}
      </StyledClassList>
    );

  return (
    <StyledClassList>
      <MiniNav />
      {classes.map((cls) => (
        <StyledClass
          className="classlist"
          key={cls.id}
          to={`${navigateto}${cls.name}`}
        >
          {cls.name}
        </StyledClass>
      ))}
    </StyledClassList>
  );
}

function AddClassForm({ setAddClass, updateClass }) {
  const { handleSubmit, register } = useForm();
  const { addingClass, isAddingClass } = useAddClass();
  if (isAddingClass) return <Spinner size="medium" />;

  function submit(data) {
    updateClass?.setShowForm(false);
    if (updateClass)
      return updateClass.updatingClass([
        { previousName: updateClass.name },
        data,
      ]);
    addingClass(data);
    setAddClass(false);
  }

  return (
    <Modal onClose={updateClass?.setShowForm ?? setAddClass}>
      <NewForm
        onSubmit={handleSubmit(submit)}
        formName={updateClass ? 'Update Class' : 'Add new class'}
        action={updateClass ? 'Update' : 'Add class'}
      >
        <InputColumn>
          <InputBox
            value={updateClass?.name ?? ''}
            {...register('name')}
            label="Class Name"
          />

          <SelectBox
            value={updateClass?.section ?? ''}
            label="Section"
            {...register('section', { required: true })}
          >
            <option value="pc">PC</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
          </SelectBox>
        </InputColumn>
      </NewForm>
    </Modal>
  );
}

ClassList.propTypes = {
  specifiedRoute: PropTypes.string.isRequired,
};
AddClassForm.propTypes = {
  setAddClass: PropTypes.string.isRequired,
  updateClass: PropTypes.string.isRequired,
};
export default ClassList;
