import { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import {
  Search,
  Save,
  Download,
  Edit3,
  Users,
  TrendingUp,
  CheckCircle,
  Award,
} from "lucide-react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ManageClassAndSubjectScores,
  UpdateMarks,
} from "../services/managexam";
import toast from "react-hot-toast";
import { addRemarksToResult } from "../utils/helper";
import Spinner from "../ui/Spinner";

const Container = styled.div`
  min-height: 100vh;
  background-color: var(--color-gray-100);
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 32px 40px;
  margin: 1rem;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 8px 0;
  letter-spacing: -0.025em;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 16px;
  margin: 0 0 32px 0;
  font-weight: 400;

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 0 0 24px 0;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 44px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #9ca3af;
  }

  @media (max-width: 768px) {
    padding: 14px 16px 14px 44px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const SearchIcon = styled(Search)`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  width: 18px;
  height: 18px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    gap: 8px;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: ${(props) => (props.primary ? "#3b82f6" : "white")};
  color: ${(props) => (props.primary ? "white" : "#374151")};
  border: 1px solid ${(props) => (props.primary ? "#3b82f6" : "#d1d5db")};
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: ${(props) => (props.primary ? "#2563eb" : "#f9fafb")};
    border-color: ${(props) => (props.primary ? "#2563eb" : "#9ca3af")};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 14px 16px;
    font-size: 14px;
  }
`;

const MainContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px 40px;

  @media (max-width: 768px) {
    padding: 20px 16px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 24px;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
  }
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
  }
`;

const StatLabel = styled.div`
  color: #64748b;
  font-size: 14px;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const StatValue = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;

  @media (max-width: 768px) {
    font-size: 24px;
  }
`;

const StudentsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(480px, 1fr));
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const StudentCard = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: #cbd5e1;
  }

  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const StudentHeader = styled.div`
  padding: 24px 24px 0 24px;
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    padding: 20px 16px 0 16px;
    gap: 12px;
  }
`;

const StudentAvatar = styled.div`
  width: 48px;
  height: 48px;
  background: #e2e8f0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  font-weight: 600;
  font-size: 16px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 14px;
  }
`;

const StudentInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const StudentName = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 1.3;
  }
`;

const StudentId = styled.p`
  color: #64748b;
  font-size: 13px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const SubjectsContainer = styled.div`
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const SubjectCard = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #f1f5f9;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 16px;
    margin-bottom: 12px;
  }
`;

const SubjectHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 12px;
  }
`;

const SubjectName = styled.h4`
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const SubjectMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SubjectTotal = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #475569;
  background: white;
  padding: 4px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 3px 8px;
  }
`;

const SubjectGrade = styled.div`
  background: ${(props) => props.color || "#f1f5f9"};
  color: ${(props) => props.textColor || "#475569"};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  min-width: 24px;
  text-align: center;
`;

const ScoresGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ScoreField = styled.div``;

const ScoreLabel = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 11px;
    margin-bottom: 4px;
  }
`;

const ScoreInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  text-align: center;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  background: white;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:invalid {
    border-color: #ef4444;
  }

  @media (max-width: 768px) {
    padding: 12px 8px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 80px 20px;
  color: #64748b;

  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const EmptyIcon = styled.div`
  width: 64px;
  height: 64px;
  background: #f1f5f9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  color: #94a3b8;

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    margin: 0 auto 16px;
  }
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const EmptyDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const AIMarksProcessor = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const selectedClass = params.get("class");
  const selectedSubject = params.get("subject");
  const selectedTerm = params.get("term");

  const queryClient = useQueryClient();

  const { data: studentToBeScored = [], isLoading: isGettingStd } = useQuery({
    queryKey: [selectedClass, selectedSubject, selectedTerm],
    queryFn: () =>
      ManageClassAndSubjectScores(selectedClass, selectedSubject, selectedTerm),
    enabled: !!selectedClass && !!selectedSubject && !!selectedTerm, // avoid query without params
  });

  // students state that reacts to query result
  const [students, setStudents] = useState([]);

  useEffect(() => {
    if (studentToBeScored) {
      setStudents(studentToBeScored);
    }
  }, [studentToBeScored]);

  const [searchTerm, setSearchTerm] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const { mutate: saveStudentScores, isPending: isSavingScores } = useMutation({
    mutationFn: () =>
      UpdateMarks(students, selectedSubject, selectedClass, selectedTerm),
    onSuccess: () => {
      // queryClient.invalidateQueries({
      //   queryKey: [selectedClass, selectedSubject, selectedTerm],
      // });
      toast.success("Scores successfully added");
      navigate(-1);
    },
    onError: (err) => toast.error(err.message),
  });

  function getGradeInfo(percentage) {
    if (percentage >= 70)
      return { grade: "EXCELLENT", color: "#10b981", textColor: "white" };
    if (percentage >= 60)
      return { grade: "V.GOOD", color: "  #7055f8", textColor: "white" };
    if (percentage >= 50)
      return { grade: "GOOD", color: "#3b82f6 ", textColor: "white" };
    if (percentage >= 40)
      return { grade: "FAIR", color: "#f59e0b", textColor: "white" };
    return { grade: "FAIL", color: "#ef4444", textColor: "white" };
  }

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const stats = useMemo(() => {
    const totalStudents = students.length;

    let studentsWithScores = 0;
    let totalStudentScores = 0;
   const gradeDistribution = {
     A: 0,
     B: 0,
     C: 0,
     D: 0,
     E: 0,
     F: 0,
   };

    const scoredStudents = []; // optional: to collect students with score > 0

    students.forEach((student) => {
      const sbj = student[selectedSubject];
      if (sbj) {
        const exam = sbj.exam || 0;
        const firstTest = sbj.firstTest || 0;
        const secondTest = sbj.secondTest || 0;

        const studentTotal = exam + firstTest + secondTest;

        if (studentTotal > 0) {
          studentsWithScores++;
          totalStudentScores += studentTotal;
          scoredStudents.push({
            name: student.name,
            total: studentTotal,
          });

        if (studentTotal >= 70) {
          gradeDistribution.A++;
        } else if (studentTotal >= 60) {
          gradeDistribution.B++;
        } else if (studentTotal >= 50) {
          gradeDistribution.C++;
        } else if (studentTotal >= 40) {
          gradeDistribution.D++;
        } else if (studentTotal >= 30) {
          gradeDistribution.E++;
        } else {
          gradeDistribution.F++; // Below 30
        }
        }
      }
    });

    const averageScore =
      studentsWithScores > 0 ? totalStudentScores / studentsWithScores : 0;

    // Determine top grade
    const gradePriority = ["EXCELLENT", "V.GOOD", "GOOD", "FAIR", "FAIL"];
    let topGrade = "FAIL";
    gradePriority.forEach((grade) => {
      if (
        gradeDistribution[grade] > gradeDistribution[topGrade] ||
        (gradeDistribution[grade] === gradeDistribution[topGrade] &&
          gradePriority.indexOf(grade) < gradePriority.indexOf(topGrade))
      ) {
        topGrade = grade;
      }
    });

    return {
      totalStudents,
      studentsWithScores,
      averageScore,
      completionRate:
        totalStudents > 0
          ? Math.round((studentsWithScores / totalStudents) * 100)
          : 0,
      topGrade,
      scoredStudents, // optional: list of students who scored > 0
    };
  }, [students, selectedSubject]);

 const updateScore = (studentIndex, subject, scoreType, value) => {
   // Allow empty string, otherwise parse as number
   const numValue = value === "" ? "" : Number.parseInt(value);

   // Only validate if there's a value
   if (numValue !== "" && (numValue < 0 || numValue > 100)) return;

   setStudents((prev) => {
     const updated = [...prev];
     if (!updated[studentIndex][subject]) {
       updated[studentIndex][subject] = {};
     }
     updated[studentIndex][subject][scoreType] = numValue;
     return updated;
   });
   setHasChanges(true);
 };
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2);
  };

  const calculateTotal = (scores) => {
    if (!scores || typeof scores !== "object") return 0;
    return Object.values(scores).reduce((sum, score) => sum + (score || 0), 0);
  };

  const calculateOverallGrade = (student) => {
    let totalScore = 0;
    let subjectCount = 0;

    Object.keys(student).forEach((key) => {
      if (
        key !== "name" &&
        key !== "image" &&
        student[key] &&
        typeof student[key] === "object"
      ) {
        totalScore += calculateTotal(student[key]);
        subjectCount++;
      }
    });

    if (subjectCount === 0)
      return { grade: "N/A", color: "#9ca3af", textColor: "white" };

    const percentage = (totalScore / (subjectCount * 100)) * 100;
    return getGradeInfo(percentage);
  };

  const handleSave = () => {
    saveStudentScores();
    setHasChanges(false);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(students, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-scores.json";
    link.click();
  };
  if (isGettingStd) return <Spinner size="small" />;
  return (
    <Container>
      <Header>
        <HeaderContent>
          <Title>{`Score Review for ${selectedTerm.toUpperCase()}`}</Title>
          <Subtitle>
            Review and edit AI-extracted student assessment scores
          </Subtitle>

          <ControlsRow>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search students by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <SearchIcon />
            </SearchContainer>

            <ButtonGroup>
              <ActionButton onClick={handleSave} primary disabled={!hasChanges}>
                <Save size={16} />
                {isSavingScores ? "Saving..." : "Save Changes"}
              </ActionButton>

              <ActionButton onClick={handleExport}>
                <Download size={16} />
                Export Data
              </ActionButton>
            </ButtonGroup>
          </ControlsRow>
        </HeaderContent>
      </Header>

      <MainContent>
        <StatsGrid>
          <StatCard>
            <StatHeader>
              <StatIcon>
                <Users size={20} />
              </StatIcon>
              <StatLabel>Total Students</StatLabel>
            </StatHeader>
            <StatValue>{stats.totalStudents}</StatValue>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon>
                <CheckCircle size={20} />
              </StatIcon>
              <StatLabel>Students with Scores</StatLabel>
            </StatHeader>
            <StatValue>{stats.studentsWithScores}</StatValue>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon>
                <TrendingUp size={20} />
              </StatIcon>
              <StatLabel>Average Score</StatLabel>
            </StatHeader>
            <StatValue>{stats.averageScore.toFixed(2)}</StatValue>
          </StatCard>

          <StatCard>
            <StatHeader>
              <StatIcon>
                <Award size={20} />
              </StatIcon>
              <StatLabel>Most Common Grade</StatLabel>
            </StatHeader>
            <StatValue>{stats.topGrade}</StatValue>
          </StatCard>
        </StatsGrid>

        {filteredStudents.length === 0 ? (
          <EmptyState>
            <EmptyIcon>
              <Search size={24} />
            </EmptyIcon>
            <EmptyTitle>No students found</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search criteria to find students
            </EmptyDescription>
          </EmptyState>
        ) : (
          <StudentsGrid>
            {filteredStudents.map((student, index) => {
              const overallGrade = calculateOverallGrade(student);

              return (
                <StudentCard key={index}>
                  <StudentHeader>
                    <StudentAvatar>{getInitials(student.name)}</StudentAvatar>
                    <StudentInfo>
                      <StudentName>{student.name}</StudentName>
                      <StudentId>
                        ID: {String(index + 1).padStart(4, "0")}
                      </StudentId>
                    </StudentInfo>
                  </StudentHeader>

                  <SubjectsContainer>
                    {Object.keys(student).map((key) => {
                      if (key === "name" || key === "image") return null;

                      const scores = student[key] || {
                        exam: 0,
                        firstTest: 0,
                        secondTest: 0,
                      };
                      const total = calculateTotal(scores);
                      const percentage = (total / 100) * 100;
                      const gradeInfo = getGradeInfo(percentage);

                      return (
                        <SubjectCard key={key}>
                          <SubjectHeader>
                            <SubjectName>
                              <Edit3 size={14} />
                              {key}
                            </SubjectName>
                            <SubjectMeta>
                              <SubjectTotal>{total}/100</SubjectTotal>
                              <SubjectGrade
                                color={gradeInfo.color}
                                textColor={gradeInfo.textColor}
                              >
                                {gradeInfo.grade}
                              </SubjectGrade>
                            </SubjectMeta>
                          </SubjectHeader>

                          <ScoresGrid>
                            <ScoreField>
                              <ScoreLabel>First Test</ScoreLabel>
                              <ScoreInput
                                type="number"
                                min={0}
                                max={15}
                                value={scores.firstTest ?? ""}
                                onChange={(e) => {
                                  const value =
                                    e.target.value === "" ? "" : e.target.value;
                                  updateScore(index, key, "firstTest", value);
                                }}
                              />
                            </ScoreField>

                            <ScoreField>
                              <ScoreLabel>Second Test</ScoreLabel>
                              <ScoreInput
                                type="number"
                                min="0"
                                max="15"
                                value={scores.secondTest ?? ""}
                                onChange={(e) =>
                                  updateScore(
                                    index,
                                    key,
                                    "secondTest",
                                    e.target.value
                                  )
                                }
                              />
                            </ScoreField>

                            <ScoreField>
                              <ScoreLabel>Exam</ScoreLabel>
                              <ScoreInput
                                type="number"
                                min="0"
                                max="70"
                                value={scores.exam ?? ""}
                                onChange={(e) =>
                                  updateScore(
                                    index,
                                    key,
                                    "exam",
                                    e.target.value
                                  )
                                }
                              />
                            </ScoreField>
                          </ScoresGrid>
                        </SubjectCard>
                      );
                    })}
                  </SubjectsContainer>
                </StudentCard>
              );
            })}
          </StudentsGrid>
        )}
      </MainContent>
    </Container>
  );
};

export default AIMarksProcessor;
