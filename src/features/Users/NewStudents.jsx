import styled from 'styled-components';
import NewIntake from '../../ui/NewIntake';
import Student from '../../ui/NewStudents';
import Spinner from '../../ui/Spinner';
import { fetchAllStudents, fetchStudents } from '../../services/schoolStudents';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useAuth } from '../../services/AuthContext';

const StyledStudents = styled.div`
  border-radius: 4px;
  background-color: var(--color-white);
  box-shadow: 0px 0px 0px 1px lightgray;
  border: 0.2px solid ligtgray;
  overflow: scroll;
`;

function NewStudents() {
  const { user } = useAuth;
  const {
    data: students,
    isLoading: isGettingStudents,
    error,
  } = useQuery({
    queryKey: ['students'],
    queryFn: () => fetchStudents(user?.data?.class_id),
  });
  const newStudents = students?.slice(0, 3);

  if (isGettingStudents)
    return (
      <div style={{ position: 'relative', top: '-5rem' }}>
        <Spinner size="small" />
      </div>
    );
  if (error) return toast.error(error.message);

  return (
    <NewIntake label1="New Students">
      {newStudents.map((std) => (
        <Student name={std.name} label={std.class_id} key={std.name} />
      ))}
    </NewIntake>
  );
}

export default NewStudents;
