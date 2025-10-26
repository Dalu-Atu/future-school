import styled from "styled-components";
import Results from "./Results";
import { assignScores } from "../utils/helper";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../services/schoolStudents";
import { useLocation } from "react-router-dom";
import Spinner from "./Spinner";
import Card from "./ReportCard";

const Container = styled.div``;
function ResultContainer() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedClass = params.get("class");
  const selectedTerm = params.get("term");

  // useEffect(() => {
  //   // Dynamically import Bootstrap CSS when this component loads
  //   const link = document.createElement("link");
  //   link.href =
  //     "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css";
  //   link.rel = "stylesheet";
  //   link.integrity =
  //     "sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm";
  //   link.crossOrigin = "anonymous";
  //   document.head.appendChild(link);

  //   // Remove the Bootstrap CSS when the component unmounts
  //   return () => {
  //     document.head.removeChild(link);
  //   };
  // }, []);

  const { data: students, isLoading: isGettingStudents } = useQuery({
    queryKey: ["students", selectedClass],
    queryFn: () => fetchStudents(selectedClass),
  });

  if (!selectedClass || selectedTerm === "")
    return (
      <div style={{ textAlign: "center", padding: "10rem" }}>
        <h3>Ooops....</h3>
        <p>Please select a class and a Term</p>
      </div>
    );

  if (isGettingStudents) return <Spinner size="medium" />;
  if (students.length < 1)
    return (
      <div style={{ textAlign: "center", padding: "10rem" }}>
        <h3>Ooops....</h3>
        <p>There is no student in this class</p>
      </div>
    );

  const studentResults = assignScores(students, selectedTerm);
  const studentsLength = studentResults.length;

  return (
    <Container>
      {studentResults?.map((result) => (
        <Card
          formTeacher={students[0].formTeacher}
          key={result.id}
          data={result}
          length={studentsLength}
          term={selectedTerm}
        />
      ))}
    </Container>
  );
}

export default ResultContainer;

