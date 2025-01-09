import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { fetchStudents } from "../services/schoolStudents";
import Spinner from "../ui/Spinner";
import ChooseClass from "../ui/ChooseClass";
import styled from "styled-components";
import { useSettings } from "../services/settingContext";

const PageHeader = styled.h2`
  margin: 1rem;
  text-align: center;
  font-weight: 800;
`;
const Container = styled.div`
  padding: 2rem;
  height: calc(100vh - 58px);
  @media (max-width: 600px) {
    padding: 1rem;
  }
`;
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const TableHeader = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  background-color: #f2f2f2;
  font-size: small;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f9f9f9;
  }
  &:hover {
    background-color: #ddd;
  }
`;

const TableCell = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
  font-size: 4px;

  p {
    font-size: small;
  }
`;

function calculateTotalScore(subjectScores) {
  return Object.values(subjectScores).reduce(
    (total, { firstTest, secondTest, exam }) =>
      total + (firstTest || 0) + (secondTest || 0) + (exam || 0),
    0
  );
}

function calculateAverage(totalScore, numberOfSubjects) {
  return (totalScore / numberOfSubjects).toFixed(2);
}

function BroadSheet() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const classStudents = params.get("class");
  const term = params.get("term");
  const settings = useSettings();

  const { currentTerm, currentSection, schoolName } = settings;

  const { data, isLoading } = useQuery({
    queryKey: ["accesspage", classStudents],
    queryFn: () => fetchStudents(classStudents),
  });

  if (isLoading) return <Spinner size="medium" />;

  if (!classStudents)
    return (
      <Container>
        <PageHeader>View Broadsheet</PageHeader>
        <ChooseClass
          redirectRoute={"view-broadsheet"}
          btnLabel="View Broadsheet"
        />
      </Container>
    );

  const studentsWithScores = data.map((student) => {
    const termScores = student.examScores[term] || {};
    const totalScore = calculateTotalScore(termScores);
    const average = calculateAverage(
      totalScore,
      Object.keys(termScores).length
    );

    return {
      id: student.id,
      name: student.name,
      gender: student.gender,
      termScores,
      totalScore,
      average,
    };
  });

  // Sorting by total scores to calculate position
  studentsWithScores.sort((a, b) => b.totalScore - a.totalScore);

  // Assigning positions
  studentsWithScores.forEach((student, index) => {
    student.position = index + 1;
  });

  const allSubjects = Object.keys(studentsWithScores[0].termScores);

  return (
    <Container>
      <PageHeader>
        <h1 style={{ color: "#03387e", fontWeight: "1000" }}>
          {schoolName.toUpperCase()}
        </h1>
        {currentTerm} BROADSHEET FOR {classStudents.toUpperCase()}`{" "}
        {currentSection}`
      </PageHeader>
      <Table>
        <thead>
          <tr>
            <TableHeader>S/N</TableHeader>
            <TableHeader>Name</TableHeader>
            <TableHeader>Gender</TableHeader>
            {allSubjects.map((subject) => (
              <TableHeader key={subject}>{subject}</TableHeader>
            ))}
            <TableHeader>Total Score</TableHeader>
            <TableHeader>Average</TableHeader>
            <TableHeader>Position</TableHeader>
          </tr>
        </thead>
        <tbody>
          {studentsWithScores.map((student, index) => (
            <TableRow key={student.id}>
              <TableCell>
                <p>{index + 1}</p>
              </TableCell>
              <TableCell>
                <p style={{ textAlign: "left" }}>
                  {student.name.toUpperCase()}
                </p>
              </TableCell>
              <TableCell>
                <p>{student.gender}</p>
              </TableCell>
              {allSubjects.map((subject) => {
                const subjectScores = student.termScores[subject] || {};
                const total =
                  (subjectScores.firstTest || 0) +
                  (subjectScores.secondTest || 0) +
                  (subjectScores.exam || 0);
                return (
                  <TableCell key={subject}>
                    <p>{total}</p>
                  </TableCell>
                );
              })}
              <TableCell>
                <p>{student.totalScore}</p>
              </TableCell>
              <TableCell>
                <p>{student.average}</p>
              </TableCell>
              <TableCell>
                <p style={{ color: "blue", fontWeight: "700" }}>
                  {student.position}
                </p>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default BroadSheet;
