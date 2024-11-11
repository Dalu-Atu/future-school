import styled from "styled-components";
import Results from "./Results";
import { assignScores } from "../utils/helper";
import { useQuery } from "@tanstack/react-query";
import { fetchStudents } from "../services/schoolStudents";
import { useLocation } from "react-router-dom";
import Spinner from "./Spinner";
import Card from "./ReportCard";
import { useEffect } from "react";
import { getFormTeacherForClass } from "../services/teachersService";
import toast from "react-hot-toast";

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

// [{…}]
// 0
// :
// cartegory
// :
// "students"
// class_id
// :
// "PC 4 Lavender"
// created_at
// :
// "2024-04-30T14:52:15.889578+00:00"
// examScores
// :
// {CRS: {…}, ENGLISH: {…}, Letter Work: {…}, Number Works: {…}}
// gender
// :
// "male"
// id
// :
// 3
// name
// :
// "migthy"
// password
// :
// "mughen"
// reports
// :
// {absent: 6, present: 5, remarks: 7, neatness: 2, creativity: 4, …}
// section
// :
// "secondary"
// username
// :
// "mighty"

// i have an array of object like the one above and i want to include some field on each student obj,
// first the total point.
// loop over all the student and calculate the the total score of all thier subject in the examScore array
// then add a field in the student object and give it the value of the total score
// also i want a position you can check for the student with the highest score and give them positions like 1st 2nd 3rd and so on.
// add a field on each student and give it a position
// also i want you to create another field alao with the average mark of each student
