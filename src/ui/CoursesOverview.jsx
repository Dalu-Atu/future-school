import styled from 'styled-components';

const StyledCourseOverview = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  text-align: center;
`;

const Title = styled.p`
  font-weight: 600;
  color: var(--color-gray-500);
`;
const Value = styled.p`
  font-weight: 500;
  color: var(--color-gray-500);
`;

// (--color-grey-800)
function CoursesOverview() {
  return (
    <StyledCourseOverview>
      <div>
        <Title>Courses</Title>
        <Value>30 </Value>
      </div>
      <div>
        <Title>Completed</Title>
        <Value>30 </Value>
      </div>
      <div>
        <Title>Awards</Title>
        <Value>11 </Value>
      </div>
    </StyledCourseOverview>
  );
}

export default CoursesOverview;
