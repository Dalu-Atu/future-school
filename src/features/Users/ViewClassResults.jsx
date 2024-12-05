import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { fetchStudents } from "../../services/schoolStudents";
import Spinner from "../../ui/Spinner";
import toast from "react-hot-toast";
import { useAuth } from "../../services/AuthContext";
import { Restricted } from "./AddStudentReport";
import { assignScores } from "../../utils/helper";
import { useSettings } from "../../services/settingContext";
const ListsProperties = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 3rem 1.5rem 0 1.5rem;
  padding: 10px;
  color: var(--color-white);
  background-color: #34d399;
  font-weight: 700;
  word-spacing: 2px;
  border-radius: 3px;

  p {
    flex: 1; /* Make each field equally wide */
    text-align: center;
    font-size: 1.4rem; /* Adjust font size for better fit */
  }
`;

const StudentList = styled.div`
  display: flex;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  justify-content: space-between;
  align-items: center;
  margin: 1rem 1.5rem;
  padding: 10px;
  background-color: var(--color-gray-100);
  border-radius: 5px;
  box-shadow: 2px 2px 3px var(--color-gray-300);

  p {
    flex: 1;
    text-align: center;
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    p {
      font-size: 1, 2rem; /* Adjust font size for smaller screens */
    }
  }
`;

function Classresults() {
  const { user } = useAuth();
  const settings = useSettings();
  const formTeachersClass = user?.data?.isFormTeacher?.[0] || false;

  const {
    data: students,
    isLoading: isGettingtudents,
    error,
  } = useQuery({
    queryKey: ["stuedents results", formTeachersClass],
    queryFn: async () => await fetchStudents(formTeachersClass),
  });

  const toCamelCase = (term) => {
    return term
      .toLowerCase() // Convert to lowercase
      .split(" ") // Split by space
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      ) // Capitalize first letter of each word except the first
      .join(""); // Join back to a single string
  };

  const term = toCamelCase(settings.currentTerm);
  const studentDetailsAndPosition = students
    ? assignScores(students, term)
    : [];

  if (!formTeachersClass)
    return <Restricted status="Only form teachers can view studets results!" />;
  if (isGettingtudents) return <Spinner size="medium" />;
  if (error) return toast.error("Something went wrong. Please try again");
  console.log(studentDetailsAndPosition);

  return (
    <div style={{ paddingBottom: "7rem" }}>
      <ListsProperties>
        <p>Names</p>
        <p>Total Scores</p>
        <p>Average</p>
        <p>Positions</p>
      </ListsProperties>
      <div>
        {studentDetailsAndPosition.map((currStudent) => {
          return (
            <StudentList key={currStudent.id}>
              <p style={{ fontSize: "small" }}>{currStudent.name}</p>
              <p>
                <b>{currStudent.totalScore}</b>
              </p>
              <p>
                <b>{currStudent.averageMark}</b>
              </p>
              <p>
                <b style={{ color: "#34d399", fontWeight: "1000" }}>
                  {currStudent.position}
                </b>
              </p>
            </StudentList>
          );
        })}
      </div>
    </div>
  );
}

export default Classresults;
