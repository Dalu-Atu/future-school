import { useQuery } from '@tanstack/react-query';
import { fetchStudents } from '../../services/schoolStudents';
import Results from '../../ui/Results';
import { assignScores } from '../../utils/helper';

import Spinner from '../../ui/Spinner';
import { useAuth } from '../../services/AuthContext';
import { getCurrentUser } from '../../services/apiAuth';
import { Restricted } from './AddStudentReport';

function ViewResult() {
  const { user } = useAuth();
  const currentStudent = user?.data;
  const selectedClass = currentStudent.class_id;

  const { data: students, isLoading: isGettingStudents } = useQuery({
    queryKey: ['student result', selectedClass],
    queryFn: () => fetchStudents(selectedClass),
  });

  if (!getCurrentUser) return;
  if (isGettingStudents) return <Spinner size="medium" />;
  const studentResults = assignScores(students);

  const studentsLength = studentResults.length;
  const currentStudentResult = studentResults.find(
    (std) => std.name === currentStudent.name
  );

  if (!currentStudentResult.hasAccess)
    return (
      <Restricted status="Please contact your form teacher to clear up pending fees" />
    );

  return (
    <div>
      <Results
        key={currentStudentResult.id}
        data={currentStudentResult}
        length={studentsLength}
      />
    </div>
  );
}
export default ViewResult;
