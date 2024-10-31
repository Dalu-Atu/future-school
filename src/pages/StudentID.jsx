import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import ViewIdCard from '../ui/ViewIdCard';
import IdCardBack from '../ui/idCardBack';
import { useQuery } from '@tanstack/react-query';
import { fetchStudents } from '../services/schoolStudents';
import Spinner from '../ui/Spinner';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  width: max-content;
  margin: 0 auto;
`;
function StudentID() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedClass = params.get('class');
  const [showBack, setShowBack] = useState(false); // State to toggle between front and back side of ID card

  const {
    data: classStudents,
    isLoading: isGettingStudents,
    error: errorGettinStudents,
  } = useQuery({
    queryFn: () => fetchStudents(selectedClass),
    queryKey: ['students', selectedClass],
    // enabled: !!selectedClass,
  });
  const handleClick = () => {
    setShowBack(!showBack); // Toggle between front and back side of ID card
  };

  if (isGettingStudents) return <Spinner size="medium" />;
  if (!selectedClass)
    return (
      <div style={{ textAlign: 'center', padding: '10rem' }}>
        <h3>Ooops....</h3>
        <p>Please select a class</p>
      </div>
    );
  if (classStudents.length < 1)
    return (
      <div style={{ textAlign: 'center', padding: '10rem' }}>
        <h3>Ooops....</h3>
        <p>There are no students in this class</p>
      </div>
    );

  if (errorGettinStudents) return toast.error(errorGettinStudents?.message);
  return (
    <div style={{ backgroundColor: 'white' }}>
      <Grid>
        {classStudents.map((std) =>
          showBack ? (
            <IdCardBack data={std} key={std.id} handleClick={handleClick} />
          ) : (
            <ViewIdCard
              key={std.id}
              data={std}
              className={std.class_id}
              handleClick={handleClick}
            />
          )
        )}
      </Grid>
    </div>
  );
}

export default StudentID;
